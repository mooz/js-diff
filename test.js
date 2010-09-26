var a = [
    "FooBar",
    "BazBaz",
    "HeheHe"
].join("\n");

var b = [
    "FooBar",
    "",
    "BozBaz",
    "HeheHe"
].join("\n");

var d = diff(a, b);

console.log(d);
