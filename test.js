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

var d = diff(read("a.txt"), read("b.txt"));

console.log(d);
