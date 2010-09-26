function read(path) {
    var req = new XMLHttpRequest();

    req.open("GET", path, false);
    req.send(null);

    return req.responseText;
}
