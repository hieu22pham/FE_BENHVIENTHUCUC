import EventEmitter from "events";

const _emitter = new EventEmitter();
_emitter.setMaxListeners(0); //unlimit listener(không giới hạn)

export const emitter = _emitter;

/**
 * Emit dùng để phát đi 1 event đó
 *
 * fire event:
 * + child -> parent (dùng props)
 * + parent -> child (dùng ref)
 * + còn để giải quyết cả 2 thì dùng emitter(event)
 *
 */
