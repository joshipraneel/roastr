import { test } from "node:test"
import assert from "node:assert/strict"
import { parseWordlist } from "./build-roasts.mjs"

const hi = `# Hindi roast list
| # | Text (as spoken) | Romanized | Meaning (English) | Spice | Context |
|---|---|---|---|---|---|
| 1 | उठ जा! | Uth ja! | Get up! | mild | wake |
| 2 | रील बंद कर! | Reel band kar! | Close the reels! | spicy | doom |
| 3 | बहुत गंदा | Bahut ganda | Very rude | harasser | doom |

Total: 3
`

test("parseWordlist keeps mild and spicy rows with their meaning", () => {
  assert.deepEqual(parseWordlist(hi, "hi"), [
    { lang: "hi", text: "उठ जा!", meaning: "Get up!", ctx: "wake" },
    { lang: "hi", text: "रील बंद कर!", meaning: "Close the reels!", ctx: "doom" },
  ])
})

test("parseWordlist uses the text as meaning for English rows", () => {
  const en = "| 87 | The reels will be there tomorrow! Stop! |  |  | mild | doom |\n"
  assert.deepEqual(parseWordlist(en, "en"), [
    {
      lang: "en",
      text: "The reels will be there tomorrow! Stop!",
      meaning: "The reels will be there tomorrow! Stop!",
      ctx: "doom",
    },
  ])
})
