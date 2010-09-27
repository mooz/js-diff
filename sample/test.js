document.addEventListener("DOMContentLoaded", function () {
    const CHARSET = "UTF-8";

    var fileElemA  = document.getElementById("input-file-a");
    var fileElemB  = document.getElementById("input-file-b");
    var resultArea = document.getElementById("diff-result");
    var diffButton = document.getElementById("diff-button");

    var Util = {
        E:
        function E(name, attrs, props) {
            var elem = document.createElement(name);

            if (attrs)
                for (var k in attrs)
                    if (attrs.hasOwnProperty(k))
                        elem.setAttribute(k, attrs[k]);

            if (attrs)
                for (var k in props)
                    if (props.hasOwnProperty(k))
                        elem[k] = props[k];

            return elem;
        },

        T:
        function T(txt) {
            return document.createTextNode(txt);
        },

        removeAllChild:
        function removeAllChild(elem) {
            while (elem.hasChildNodes())
                elem.removeChild(elem.firstChild);
        }
    };

    function diffStrings(_a, _b) {
        var a = _a.split("\n");
        var b = _b.split("\n");
        var d = diff(a, b);

        console.dir(d);

        return zipDiffs(a, b, d.deleted, d.added);
    }

    function diff2node(diffed) {
        var result = document.createDocumentFragment();

        var status2class = {};
        status2class[DIFF_NONE]    = "diff-none";
        status2class[DIFF_ADDED]   = "diff-added";
        status2class[DIFF_DELETED] = "diff-deleted";

        diffed.forEach(function (d) {
            result.appendChild(Util.E("pre", {
                "class" : status2class[d.status]
            }, {
                textContent : d.value
            }));
        });

        return result;
    }

    function updateDiff() {
        Util.removeAllChild(resultArea);

        var fileA = fileElemA.files[0];
        var fileB = fileElemB.files[0];

        if (!fileA || !fileB)
            return;

        var textA = fileA.getAsText(CHARSET);
        var textB = fileB.getAsText(CHARSET);

        var diffed = diffStrings(textA, textB);

        console.dir(diffed);

        resultArea.appendChild(diff2node(diffed));
    }

    fileElemA.addEventListener("change", updateDiff, false);
    fileElemB.addEventListener("change", updateDiff, false);
    diffButton.addEventListener("click", updateDiff, false);
}, false);

