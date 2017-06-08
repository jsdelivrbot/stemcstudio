/* */ 
"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
var RBNode_1 = require('./RBNode');
var RBTree = (function() {
  function RBTree(lowKey, highKey, nilValue, comp) {
    this.highKey = highKey;
    this.comp = comp;
    this.N = 0;
    this.lowNode = new RBNode_1.RBNode(lowKey, nilValue);
    this.highNode = new RBNode_1.RBNode(highKey, nilValue);
    var z = new RBNode_1.RBNode(null, nilValue);
    this.head = new RBNode_1.RBNode(lowKey, nilValue);
    this.head.l = z;
    this.head.r = z;
    this.head.p = this.head;
  }
  Object.defineProperty(RBTree.prototype, "root", {
    get: function() {
      return this.head.r;
    },
    set: function(root) {
      this.head.r = root;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(RBTree.prototype, "z", {
    get: function() {
      return this.head.l;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(RBTree.prototype, "lowKey", {
    get: function() {
      return this.head.key;
    },
    enumerable: true,
    configurable: true
  });
  RBTree.prototype.assertLegalKey = function(key, comp) {
    if (comp(key, this.lowKey) <= 0) {
      throw new Error("key, " + key + ", must be greater than the low key, " + this.lowKey + ".");
    }
    if (comp(key, this.highKey) >= 0) {
      throw new Error("key, " + key + ", must be less than the high key, " + this.highKey + ".");
    }
  };
  RBTree.prototype.insert = function(key, value) {
    var comp = this.comp;
    this.assertLegalKey(key, comp);
    var n = new RBNode_1.RBNode(key, value);
    rbInsert(this, n, comp);
    this.root.flag = false;
    this.N += 1;
    return n;
  };
  RBTree.prototype.glb = function(key) {
    var comp = this.comp;
    this.assertLegalKey(key, comp);
    var low = this.lowNode;
    var node = glb(this, this.root, key, comp, low);
    if (node !== low) {
      return node;
    } else {
      return null;
    }
  };
  RBTree.prototype.lub = function(key) {
    var comp = this.comp;
    this.assertLegalKey(key, comp);
    var high = this.highNode;
    var node = lub(this, this.root, key, comp, high);
    if (node !== high) {
      return node;
    } else {
      return null;
    }
  };
  RBTree.prototype.search = function(key) {
    var comp = this.comp;
    this.assertLegalKey(key, comp);
    var x = this.root;
    this.z.key = key;
    while (comp(key, x.key) !== 0) {
      x = comp(key, x.key) < 0 ? x.l : x.r;
    }
    return x.value;
  };
  RBTree.prototype.remove = function(key) {
    var comp = this.comp;
    this.assertLegalKey(key, comp);
    var head = this.head;
    var z = this.z;
    var x = this.root;
    var p = head;
    z.key = key;
    while (comp(key, x.key) !== 0) {
      p = x;
      x = comp(key, x.key) < 0 ? x.l : x.r;
    }
    var t = x;
    if (t.r === z) {
      x = t.l;
    } else if (t.r.l === z) {
      x = t.r;
      x.l = t.l;
    } else {
      var c = t.r;
      while (c.l.l !== z) {
        c = c.l;
      }
      x = c.l;
      c.l = x.r;
      x.l = t.l;
      x.r = t.r;
    }
    if (comp(key, p.key) < 0) {
      p.l = x;
    } else {
      p.r = x;
    }
  };
  Object.defineProperty(RBTree.prototype, "heightInvariant", {
    get: function() {
      return heightInv(this.root, this.z);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(RBTree.prototype, "colorInvariant", {
    get: function() {
      return colorInv(this.root, this.head.flag, this.z);
    },
    enumerable: true,
    configurable: true
  });
  return RBTree;
}());
exports.RBTree = RBTree;
function colorFlip(p, g, gg) {
  p.flag = false;
  g.flag = true;
  gg.flag = false;
  return g;
}
function diamondLeftToVic(lead) {
  var m = lead.p;
  var z = lead;
  var x = z.l;
  var y = x.r;
  var a = y.l;
  var b = y.r;
  x.flag = false;
  y.l = x;
  x.p = y;
  y.r = z;
  z.p = y;
  x.r = a;
  a.p = x;
  z.l = b;
  b.p = z;
  if (m.r === lead) {
    m.r = y;
  } else {
    m.l = y;
  }
  y.p = m;
  return y;
}
function diamondRightToVic(lead) {
  var m = lead.p;
  var x = lead;
  var z = x.r;
  var y = z.l;
  var a = y.l;
  var b = y.r;
  z.flag = false;
  y.l = x;
  x.p = y;
  y.r = z;
  z.p = y;
  x.r = a;
  a.p = x;
  z.l = b;
  b.p = z;
  if (m.r === lead) {
    m.r = y;
  } else {
    m.l = y;
  }
  y.p = m;
  return y;
}
function echelonLeftToVic(lead) {
  var m = lead.p;
  var z = lead;
  var y = z.l;
  var a = y.r;
  y.l.flag = false;
  y.r = z;
  z.p = y;
  z.l = a;
  a.p = z;
  if (m.r === lead) {
    m.r = y;
  } else {
    m.l = y;
  }
  y.p = m;
  return y;
}
function echelonRightToVic(lead) {
  var m = lead.p;
  var x = lead;
  var y = x.r;
  var a = y.l;
  y.r.flag = false;
  y.l = x;
  x.p = y;
  x.r = a;
  a.p = x;
  if (m.r === lead) {
    m.r = y;
  } else {
    m.l = y;
  }
  y.p = m;
  return y;
}
function colorInv(node, redParent, z) {
  if (node === z) {
    return true;
  } else if (redParent && node.flag) {
    return false;
  } else {
    return colorInv(node.l, node.flag, z) && colorInv(node.r, node.flag, z);
  }
}
function heightInv(node, z) {
  return blackHeight(node, z) >= 0;
}
function blackHeight(x, z) {
  if (x === z) {
    return 0;
  } else {
    var hL = blackHeight(x.l, z);
    if (hL >= 0) {
      var hR = blackHeight(x.r, z);
      if (hR >= 0) {
        if (hR === hR) {
          return x.flag ? hL : hL + 1;
        }
      }
    }
    return -1;
  }
}
function rbInsert(tree, n, comp) {
  var key = n.key;
  var z = tree.z;
  var x = tree.root;
  x.p = tree.head;
  while (x !== z) {
    x.l.p = x;
    x.r.p = x;
    x = comp(key, x.key) < 0 ? x.l : x.r;
  }
  n.p = x.p;
  if (x.p === tree.head) {
    tree.root = n;
  } else {
    if (comp(key, x.p.key) < 0) {
      x.p.l = n;
    } else {
      x.p.r = n;
    }
  }
  n.l = z;
  n.r = z;
  if (n.p.flag) {
    rbInsertFixup(tree, n);
  } else {
    n.flag = true;
  }
}
function rbInsertFixup(tree, n) {
  n.flag = true;
  if (!n.p.flag) {
    throw new Error("n.p must be red.");
  }
  while (n.flag) {
    var p = n.p;
    if (n === tree.root) {
      tree.root.flag = false;
      return;
    } else if (p === tree.root) {
      tree.root.flag = false;
      return;
    }
    var lead = p.p;
    if (p.flag && !lead.flag) {
      if (p === lead.l) {
        var aux = lead.r;
        if (aux.flag) {
          n = colorFlip(p, lead, aux);
        } else if (n === p.r) {
          n = diamondLeftToVic(lead);
        } else {
          n = echelonLeftToVic(lead);
        }
      } else {
        var aux = lead.l;
        if (aux.flag) {
          n = colorFlip(p, lead, aux);
        } else if (n === n.p.l) {
          n = diamondRightToVic(lead);
        } else {
          n = echelonRightToVic(lead);
        }
      }
    } else {
      break;
    }
  }
  tree.root.flag = false;
}
function glb(tree, node, key, comp, low) {
  if (node === tree.z) {
    return low;
  } else if (comp(key, node.key) >= 0) {
    return maxNode(node, glb(tree, node.r, key, comp, low), comp);
  } else {
    return glb(tree, node.l, key, comp, low);
  }
}
function lub(tree, node, key, comp, high) {
  if (node === tree.z) {
    return high;
  } else if (comp(key, node.key) <= 0) {
    return minNode(node, lub(tree, node.l, key, comp, high), comp);
  } else {
    return lub(tree, node.r, key, comp, high);
  }
}
function maxNode(a, b, comp) {
  if (comp(a.key, b.key) > 0) {
    return a;
  } else if (comp(a.key, b.key) < 0) {
    return b;
  } else {
    return a;
  }
}
function minNode(a, b, comp) {
  if (comp(a.key, b.key) < 0) {
    return a;
  } else if (comp(a.key, b.key) > 0) {
    return b;
  } else {
    return a;
  }
}
