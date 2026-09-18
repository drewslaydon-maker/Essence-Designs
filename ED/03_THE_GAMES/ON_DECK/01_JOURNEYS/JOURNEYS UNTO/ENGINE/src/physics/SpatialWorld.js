/**
 * SpatialWorld.js - Static AABB Spatial Boundary Manager
 * ESSENCE FL0W v0.1 • Journeys Top-Down RPG Engine
 * Pure ES6 - Zero external physics/math dependencies.
 */

export class SpatialWorld {
  constructor() {
    /** @type {Array<{ id?: string|number, x: number, y: number, w: number, h: number, color?: string, label?: string, [key: string]: any }>} */
    this.colliders = [];
  }

  /**
   * Adds a static AABB collider to the world
   * @param {{ id?: string|number, x: number, y: number, w: number, h: number, color?: string, label?: string, [key: string]: any }} box
   */
  addCollider(box) {
    if (!box || typeof box.x !== 'number' || typeof box.y !== 'number' || typeof box.w !== 'number' || typeof box.h !== 'number') {
      throw new Error('Invalid AABB collider structure: requires x, y, w, h numbers');
    }
    const id = box.id !== undefined ? box.id : `collider_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const collider = { 
      id, 
      x: box.x, 
      y: box.y, 
      w: box.w, 
      h: box.h,
      color: box.color,
      label: box.label,
    };
    this.colliders.push(collider);
    return collider;
  }

  /**
   * Removes a collider by its unique identifier
   * @param {string|number} id
   * @returns {boolean} True if removed
   */
  removeCollider(id) {
    const prevLen = this.colliders.length;
    this.colliders = this.colliders.filter((c) => c.id !== id);
    return this.colliders.length < prevLen;
  }

  /**
   * Returns copy or reference of all colliders
   * @returns {Array<{ id?: string|number, x: number, y: number, w: number, h: number, color?: string, label?: string, [key: string]: any }>}
   */
  getColliders() {
    return this.colliders;
  }

  /**
   * Clears all registered colliders
   */
  clear() {
    this.colliders = [];
  }

  /**
   * Overlap Predicate (Strict Open-Interval):
   * (A.x < B.x + B.w) && (A.x + A.w > B.x) && (A.y < B.y + B.h) && (A.y + A.h > B.y)
   * Note: Edge-flush contact (A.x + A.w == B.x) evaluates to FALSE.
   * @param {{ x: number, y: number, w: number, h: number }} A
   * @param {{ x: number, y: number, w: number, h: number }} B
   * @returns {boolean}
   */
  static checkOverlap(A, B) {
    return (
      A.x < B.x + B.w &&
      A.x + A.w > B.x &&
      A.y < B.y + B.h &&
      A.y + A.h > B.y
    );
  }

  /**
   * Queries if the given AABB overlaps with any static collider in the world.
   * Returns the first colliding box B, or null if clear.
   * @param {{ x: number, y: number, w: number, h: number }} box
   * @returns {{ id: string|number, x: number, y: number, w: number, h: number } | null}
   */
  queryOverlap(box) {
    for (let i = 0; i < this.colliders.length; i++) {
      const B = this.colliders[i];
      if (SpatialWorld.checkOverlap(box, B)) {
        return B;
      }
    }
    return null;
  }

  /**
   * Returns all overlapping colliders for candidate box
   * @param {{ x: number, y: number, w: number, h: number }} box
   * @returns {Array<{ id: string|number, x: number, y: number, w: number, h: number }>}
   */
  queryAllOverlaps(box) {
    const results = [];
    for (let i = 0; i < this.colliders.length; i++) {
      const B = this.colliders[i];
      if (SpatialWorld.checkOverlap(box, B)) {
        results.push(B);
      }
    }
    return results;
  }
}
