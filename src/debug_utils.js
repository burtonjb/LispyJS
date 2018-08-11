function depth(env) {
    var c = 1;
    var x = env._parent;
    while (env._parent != undefined) {
        env = env._parent;
        c += 1;

    }
    return c;
}