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

        var current_hank_end = false;
        for (var i = a_done_idx; i < a.length; a_done_idx = ++i) {
            if (!a_deleted[i]) {
                if (!current_hank_end) {
                    buffer.push("|   | " + a[i]);
                    a_done_idx = ++i;
                }

                break;
            }

            buffer.push("| - | " + a[i]);
            current_hank_end = true;
        }

        for (var j = b_done_idx; j < b.length; b_done_idx = ++j) {
            if (!b_added[j]) {
                b_done_idx = ++j;
                break;
            }
            buffer.push("| + | " + b[j]);
        }
    }

    return buffer.join("\n");
}

function diff(a, b) {
    // var diffs = [];

    var a_len = a.length;
    var b_len = b.length;

    var a_deleted = filled(a.length, false);
    var b_added   = filled(b.length, false);

    var b_seek_from = 0;

    loop_a:
    for (var i = 0; i < a_len; ++i) {
        loop_b:
        for (var j = b_seek_from; j < b_len; ++j) {
            if (a[i] === b[j]) {
                // 一致した. a の i 行目は削除されていない
                a_deleted[i] = false;

                // b の 0 ~ j - 1 行目までは「追加されたことが確定」

                for (var k = b_seek_from; k < j; ++k)
                    b_added[k] = true;

                b_seek_from = j + 1; // まだ未確定行の開始インデックス

                continue loop_a;
            }
        }

        // 一つも一致しなかった. a の i 行目は削除されたことが確定.
        a_deleted[i] = true;
    }

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

    return zipDiffs(a, b, d.deleted, d.added);
}
