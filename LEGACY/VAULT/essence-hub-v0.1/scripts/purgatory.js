const fs = require('fs');
const path = require('path');
const fse = require('fs-extra'); // We'll need fs-extra for robust moving/copying

const GRAVEYARD_PATH = path.join(process.cwd(), '..', '..', 'GRAVEYARD', 'Purgatory');
const MAX_GRAVEYARD_SIZE_MB = 10240; // 10GB
const RETENTION_DAYS = 7;

// Ensure Graveyard structure exists
if (!fs.existsSync(GRAVEYARD_PATH)) {
    fs.mkdirSync(GRAVEYARD_PATH, { recursive: true });
}

function getDirSize(dirPath) {
    let size = 0;
    const files = fs.readdirSync(dirPath);
    for (let i = 0; i < files.length; i++) {
        const filePath = path.join(dirPath, files[i]);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            size += getDirSize(filePath);
        } else {
            size += stats.size;
        }
    }
    return size;
}

async function enforceEntropyThreshold() {
    try {
        let currentSizeMB = getDirSize(GRAVEYARD_PATH) / (1024 * 1024);
        
        if (currentSizeMB > MAX_GRAVEYARD_SIZE_MB) {
            console.log(`[REAPER] Entropy threshold exceeded (${currentSizeMB.toFixed(2)}MB > ${MAX_GRAVEYARD_SIZE_MB}MB). Initiating emergency purge...`);
            
            // Gather all items and their tombstones
            const items = [];
            const graveyardFiles = fs.readdirSync(GRAVEYARD_PATH);
            
            for (const file of graveyardFiles) {
                if (file.endsWith('.tombstone.json')) {
                    const tombstonePath = path.join(GRAVEYARD_PATH, file);
                    try {
                        const tombstoneData = JSON.parse(fs.readFileSync(tombstonePath, 'utf8'));
                        items.push({
                            tombstonePath,
                            assetPath: path.join(GRAVEYARD_PATH, tombstoneData.mutatedName),
                            timestamp: tombstoneData.timestamp
                        });
                    } catch (e) {
                        console.error(`[REAPER] Failed to parse tombstone ${file}:`, e);
                    }
                }
            }
            
            // Sort by oldest first
            items.sort((a, b) => a.timestamp - b.timestamp);
            
            // Delete until we hit 8GB (80% of max)
            const TARGET_SIZE_MB = MAX_GRAVEYARD_SIZE_MB * 0.8;
            
            for (const item of items) {
                if (currentSizeMB <= TARGET_SIZE_MB) break;
                
                console.log(`[REAPER] Emergency purge: ${path.basename(item.assetPath)}`);
                try {
                    await fse.remove(item.assetPath);
                    await fse.remove(item.tombstonePath);
                    
                    // Recalculate size
                    currentSizeMB = getDirSize(GRAVEYARD_PATH) / (1024 * 1024);
                } catch (e) {
                    console.error(`[REAPER] Error removing ${item.assetPath}:`, e);
                }
            }
            console.log(`[REAPER] Emergency purge complete. Current size: ${currentSizeMB.toFixed(2)}MB`);
        }
    } catch (e) {
        console.error('[REAPER] Entropy enforcement error:', e);
    }
}

async function runReaperSweep() {
    console.log('[REAPER] Initiating sweep of Purgatory...');
    
    try {
        const graveyardFiles = fs.readdirSync(GRAVEYARD_PATH);
        const now = Date.now();
        const MAX_AGE_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;
        
        let purgeCount = 0;

        for (const file of graveyardFiles) {
             if (file.endsWith('.tombstone.json')) {
                const tombstonePath = path.join(GRAVEYARD_PATH, file);
                try {
                    const tombstoneData = JSON.parse(fs.readFileSync(tombstonePath, 'utf8'));
                    const age = now - tombstoneData.timestamp;
                    
                    if (age > MAX_AGE_MS) {
                        const assetPath = path.join(GRAVEYARD_PATH, tombstoneData.mutatedName);
                        console.log(`[REAPER] ${tombstoneData.mutatedName} has exceeded 7 cycles. Returning to the void...`);
                        
                        // Execute unrecoverable deletion
                        await fse.remove(assetPath);
                        await fse.remove(tombstonePath);
                        purgeCount++;
                    }
                } catch (e) {
                     console.error(`[REAPER] Error processing tombstone ${file}:`, e);
                }
             }
        }
        
        console.log(`[REAPER] Sweep complete. ${purgeCount} items eradicated.`);
        
        // After normal sweep, check for entropy limits
        await enforceEntropyThreshold();
        
    } catch (e) {
        console.error('[REAPER] Sweep failed:', e);
    }
}

async function essenceDelete(targetPath, reason) {
    if (!reason) {
        throw new Error('DOER_INTENT required: You must provide a reason for deletion via the --reason flag.');
    }

    const resolvedPath = path.resolve(targetPath);
    if (!fs.existsSync(resolvedPath)) {
        throw new Error(`Target does not exist: ${resolvedPath}`);
    }

    const originalName = path.basename(resolvedPath);
    const timestamp = Date.now();
    const mutatedName = `${originalName}.${timestamp}`;
    const graveyardDest = path.join(GRAVEYARD_PATH, mutatedName);
    const tombstoneDest = `${graveyardDest}.tombstone.json`;

    // 1. Copy to Purgatory (Robust cross-device support via fs-extra)
    console.log(`[PURGATORY] Moving ${resolvedPath} to ${graveyardDest}...`);
    await fse.copy(resolvedPath, graveyardDest);

    // 2. Write Tombstone
    const tombstone = {
        uid: mutatedName,
        doerIntent: reason,
        timestamp: timestamp,
        originalPath: resolvedPath,
        mutatedName: mutatedName
    };
    
    fs.writeFileSync(tombstoneDest, JSON.stringify(tombstone, null, 2));
    
    // 3. Delete original (only after safe transfer)
    await fse.remove(resolvedPath);
    console.log(`[PURGATORY] Artifact securely entombed. Metadata written to ${mutatedName}.tombstone.json`);
    
    // 4. Trigger light Reaper sweep
    await runReaperSweep();
}

async function essenceRestore(uidOrMutatedName) {
    const graveyardFiles = fs.readdirSync(GRAVEYARD_PATH);
    let targetTombstonePath = null;
    let targetTombstoneData = null;

    for (const file of graveyardFiles) {
        if (file.endsWith('.tombstone.json')) {
            const potentialTombstonePath = path.join(GRAVEYARD_PATH, file);
            try {
                const data = JSON.parse(fs.readFileSync(potentialTombstonePath, 'utf8'));
                if (data.uid === uidOrMutatedName || data.mutatedName === uidOrMutatedName || file.startsWith(uidOrMutatedName)) {
                    targetTombstonePath = potentialTombstonePath;
                    targetTombstoneData = data;
                    break;
                }
            } catch (e) {
                 // skip unparseable
            }
        }
    }

    if (!targetTombstonePath) {
        throw new Error(`[RESURRECTION FAILED] No tombstone found matching: ${uidOrMutatedName}`);
    }

    const assetPath = path.join(GRAVEYARD_PATH, targetTombstoneData.mutatedName);
    const restoreDest = targetTombstoneData.originalPath;

    if (!fs.existsSync(assetPath)) {
        throw new Error(`[RESURRECTION FAILED] Tombstone exists, but physical artifact ${targetTombstoneData.mutatedName} is missing from Purgatory.`);
    }

    console.log(`[RESURRECTION] Restoring ${targetTombstoneData.mutatedName} to ${restoreDest}...`);
    
    // Ensure parent directories exist
    await fse.ensureDir(path.dirname(restoreDest));
    
    // 1. Copy back
    await fse.copy(assetPath, restoreDest);
    
    // 2. Eradicate from Purgatory
    await fse.remove(assetPath);
    await fse.remove(targetTombstonePath);
    
    console.log(`[RESURRECTION] Artifact restored successfully. Tombstone shattered.`);
}

module.exports = {
    essenceDelete,
    essenceRestore,
    runReaperSweep
};