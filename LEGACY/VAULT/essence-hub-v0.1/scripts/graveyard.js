require('dotenv').config();
const { essenceDelete, essenceRestore, runReaperSweep } = require('./purgatory');

const args = process.argv.slice(2);
const command = args[0];

async function main() {
    try {
        if (command === 'delete') {
            const targetPath = args[1];
            // Find the --reason flag
            const reasonIndex = args.indexOf('--reason');
            let reason = null;
            if (reasonIndex !== -1 && args[reasonIndex + 1]) {
                reason = args[reasonIndex + 1];
            }
            
            await essenceDelete(targetPath, reason);
        } 
        else if (command === 'restore') {
            const id = args[1];
            if (!id) throw new Error('Must provide a tombstone ID or mutated filename to restore.');
            await essenceRestore(id);
        }
        else if (command === 'sweep') {
            await runReaperSweep();
        }
        else {
            console.log(`
[PURGATORY CLI]
Usage:
  node graveyard.js delete <path> --reason "Why this is being deleted"
  node graveyard.js restore <tombstone_uid_or_filename>
  node graveyard.js sweep
            `);
        }
    } catch (e) {
        console.error(`[FATAL] ${e.message}`);
        process.exit(1);
    }
}

main();