const DIFF_NONE    = 0;
const DIFF_ADDED   = 1;
const DIFF_DELETED = 2;

function filled(len, c) {
    var array = new Array(len);
    for (var i = 0; i < array.length; ++i)
        array[i] = c;
    return array;
}

function zipDiffs(a, b, a_deleted, b_added) {
    var a_done_idx = 0, b_done_idx = 0;
    var buffer = [];

    for (;;) {
        if (a_done_idx === a.length &&
            b_done_idx === b.length) {
            // finish
            break;
        }

        for (var j = b_done_idx; j < b.length; ++j) {
            b_done_idx = j + 1;

            if (!b_added[j])
                break;

            buffer.push({ value : b[j], status : DIFF_ADDED });
        }

        for (var i = a_done_idx; i < a.length; ++i) {
            a_done_idx = i + 1;

            if (!a_deleted[i]) {
                buffer.push({ value : a[i], status : DIFF_NONE });
                break;
            }

            buffer.push({ value : a[i], status : DIFF_DELETED });
        }
    }

    return buffer;
}

function diff(a, b) {
    // var diffs = [];

    var a_len = a.length;
    var b_len = b.length;

    var a_deleted = filled(a.length, false);
    var b_added   = filled(b.length, false);

    var b_seek_from = 0;

    LOOP_A:
    for (var i = 0; i < a_len; ++i) {
        for (var j = b_seek_from; j < b_len; ++j) {
            if (a[i] === b[j]) {
                // 一致した. a の i 行目は削除されていない
                a_deleted[i] = false;

                // b の 0 ~ j - 1 行目までは「追加されたことが確定」

                for (var k = b_seek_from; k < j; ++k)
                    b_added[k] = true;

                b_seek_from = j + 1; // まだ未確定行の開始インデックス

                continue LOOP_A;
            }
        }

        // 一つも一致しなかった. a の i 行目は削除されたことが確定.
        a_deleted[i] = true;
    }

    // 最後に残ったモノを added に.
    for (var k = b_seek_from; k < b_len; ++k)
        b_added[k] = true;

    return {
        "deleted" : a_deleted,
        "added"   : b_added
    };
}

function diffString(_a, _b) {
    var a = _a.split("\n");
    var b = _b.split("\n");
    var d = diff(a, b);

    var zipped = zipDiffs(a, b, d.deleted, d.added);

    return zipped.map(function (l) {
        var prefix;

        switch (l.status) {
        case DIFF_NONE:
            prefix = " ";
            break;
        case DIFF_ADDED:
            prefix = "+";
            break;
        case DIFF_DELETED:
            prefix = "-";
            break;
        }

        return "| " + prefix + " | " + l.value;
    }).join("\n");
}
