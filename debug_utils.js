function depth(p) {
    var c = 1;
    var x = p._parent;
    while (p._parent != undefined) {
        p = p._parent;
        c += 1;

    }
    return c;
}