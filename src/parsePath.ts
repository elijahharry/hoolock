const QUOTE = /^['"]$/;
const KEY_START = /^[.\[]$/;

function parsePath(path: string): string[] {
  const keys: string[] = [],
    len = path.length;

  keyParser: for (
    let i = path[0] === "." ? (keys.push(""), 1) : 0;
    i < len;
    i++
  ) {
    let char: string = path[i],
      key: string,
      braced: boolean | undefined;

    if (char === "." || ((braced = char === "[") && i !== len - 1)) {
      char = path[++i];
    }

    if (braced && QUOTE.test(char)) {
      // Atempt to complete the quote
      const quote = char;
      key = "";
      let escaped = false,
        // value = "",
        qi = i + 1;

      for (qi; qi < len; qi++) {
        char = path[qi];
        if (escaped) {
          escaped = false;
        } else {
          if (char === quote) {
            if (braced) {
              // If this is a bracket key, then the quote must be followed by a closing bracket
              if (path[qi + 1] === "]") {
                i = qi + 1;
                keys.push(key);
                continue keyParser;
              }
              // Otherwise, the quote is a valid key if it's at the end of the path, or if
              // it's followed by a key start (dot or opening bracket)
            } else if (qi === len - 1 || KEY_START.test(path[qi + 1])) {
              i = qi;
              keys.push(key);
              continue keyParser;
            }
            // Otherwise, don't assume this is an enquoted key. Break and parse as a normal key below
            break;
          }
          if (char === "\\") {
            escaped = true;
            // Continue, don't add the escape character
            continue;
          }
        }
        key += char;
      }
    }

    key = "";
    // Find the end of this key
    //  - If this is a bracket key, then the end is the closing bracket
    //  - If this is a dot key, then the end is the next dot or bracket
    for (i; i < len; i++) {
      char = path[i];
      if (braced && char === "]") break;
      if (KEY_START.test(char)) {
        i--;
        if (braced) {
          // If we've reached the start of a new key, then this never should've been
          // interpreted as a bracket key. Add the opening bracket back to the key
          key = "[" + key;
          if (keys.length) {
            // Because this never should've been interpreted as a unique key, attempt
            // to append it to the previous key
            keys[keys.length - 1] += key;
            continue keyParser;
          }
        }
        // Otherwise break, will push as a new key below
        break;
      }
      key += char;
    }
    keys.push(key);
  }
  return keys;
}

export default parsePath;
