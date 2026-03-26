import * as crypto from "node:crypto";
import { inArray } from "drizzle-orm";
import { db } from "./index";
import { roastIssues, roasts } from "./schema";

function generateSlug(title: string): string {
  const base = title
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  const hash = crypto.randomBytes(3).toString("hex");
  return `${base}-${hash}`;
}

async function main() {
  console.log("🌱 Seeding database with initial data...");

  const hash0 = crypto
    .createHash("sha256")
    .update(`cpp:true:#include <iostream>
#include <string>

using namespace std;

class DataProcessorManager {
public:
    int* buffer;
    string internalId;

    DataProcessorManager(string id) {
        internalId = id;
        buffer = new int[5000];
        cout << "Service started." << endl;
    }
};

int calculate(int val1, int val2) {
    int a = val1;
    int b = val2;
    bool flag = !!(a > b);

    if (flag)
        if (a % 2 == 0) return a * 10;
        else return b * 5;
    else
        return a + b;
}

int main() {
    DataProcessorManager* proc = new DataProcessorManager("X-100");
    calculate(50, 100);
    return 0;
}`)
    .digest("hex");
  const hash1 = crypto
    .createHash("sha256")
    .update(`python:true:def do_math(a, b):
    # This does math
    c = a + b
    c = c - b
    c = c + b
    return c`)
    .digest("hex");
  const hash2 = crypto
    .createHash("sha256")
    .update(`javascript:true:function HelloWorld() {
  const [text, setText] = useState("Hello");
  
  useEffect(() => {
    setText("Hello");
  }, []);

  return <div>{text}</div>
}`)
    .digest("hex");
  const hash3 = crypto
    .createHash("sha256")
    .update(`javascript:true:function getUsername(name) {
    const container = [];
    container.push(name);
    const result = container[0];
    return result;
}`)
    .digest("hex");
  const hash4 = crypto
    .createHash("sha256")
    .update(`python:true:def count_to_ten():
    i = 0
    while i < 10:
        print(i)
    i += 1 `)
    .digest("hex");
  const hash5 = crypto
    .createHash("sha256")
    .update(`java:true:public boolean isAuthorized(String status) {
    if (status.equals("true") == true) {
        return true;
    } else {
        return false;
    }
}`)
    .digest("hex");
  const hash6 = crypto
    .createHash("sha256")
    .update(`c:true:int* getLocalValue() {
    int tempValue = 42;
    return &tempValue; 
}`)
    .digest("hex");
  const hash7 = crypto
    .createHash("sha256")
    .update(`php:true:<?php
$id = $_GET['id'];
$query = "SELECT * FROM users WHERE id = " . $id;
$result = $db->query($query);
?>`)
    .digest("hex");
  const hash8 = crypto
    .createHash("sha256")
    .update(`typescript:true:function processData(input: any): any {
    const data: any = input as any;
    return data.value as any;
}`)
    .digest("hex");
  const hash9 = crypto
    .createHash("sha256")
    .update(`csharp:true:public void SaveConfig() {
    try {
        File.WriteAllText("config.json", "{'theme': 'dark'}");
    } catch (Exception e) {
    }
}`)
    .digest("hex");

  const hashes = [
    hash0,
    hash1,
    hash2,
    hash3,
    hash4,
    hash5,
    hash6,
    hash7,
    hash8,
    hash9,
  ];

  await db
    .insert(roasts)
    .values([
      {
        title: "MemoryMangler",
        slug: generateSlug("MemoryMangler"),
        code: `#include <iostream>
#include <string>

using namespace std;

class DataProcessorManager {
public:
    int* buffer;
    string internalId;

    DataProcessorManager(string id) {
        internalId = id;
        buffer = new int[5000];
        cout << "Service started." << endl;
    }
};

int calculate(int val1, int val2) {
    int a = val1;
    int b = val2;
    bool flag = !!(a > b);

    if (flag)
        if (a % 2 == 0) return a * 10;
        else return b * 5;
    else
        return a + b;
}

int main() {
    DataProcessorManager* proc = new DataProcessorManager("X-100");
    calculate(50, 100);
    return 0;
}`,
        codeHash: hash0,
        fixedCode: `#include <iostream>
#include <string>

class DataProcessorManager {
public:
    int* buffer;
    std::string internalId;
    DataProcessorManager(std::string id) : internalId(id) {
        buffer = new int[5000];
        std::cout << "Service started." << std::endl;
    }
    ~DataProcessorManager() { delete[] buffer; }
};

int calculate(int val1, int val2) {
    return (val1 > val2) ? (val1 % 2 == 0 ? val1 * 10 : val2 * 5) : val1 + val2;
}

int main() {
    DataProcessorManager proc("X-100");
    calculate(50, 100);
    return 0;
}`,
        language: "cpp",
        score: "2.0",
        summary: `A catastrophic collision of memory leaks, unutilized functions, and logical lunacy, held together with what appears to be twine and prayers`,
      },
      {
        title: "ConfusedMath",
        slug: generateSlug("ConfusedMath"),
        code: `def do_math(a, b):
    # This does math
    c = a + b
    c = c - b
    c = c + b
    return c`,
        codeHash: hash1,
        fixedCode: `def do_math(a, b):
    return a + b`,
        language: "python",
        score: "2.5",
        summary: `A spectacular waste of CPU cycles. This developer has successfully invented a new way to do absolutely nothing, with extra steps.`,
      },
      {
        title: "PointlessComponent",
        slug: generateSlug("PointlessComponent"),
        code: `function HelloWorld() {
  const [text, setText] = useState("Hello");
  
  useEffect(() => {
    setText("Hello");
  }, []);

  return <div>{text}</div>
}`,
        codeHash: hash2,
        fixedCode: `function HelloWorld() {
  return <div>Hello</div>
}`,
        language: "javascript",
        score: "4.0",
        summary: `React called, it wants its useless re-renders back. This is what happens when someone learns useEffect before learning HTML.`,
      },
      {
        title: "OverengineeredUsernameExtractor",
        slug: generateSlug("OverengineeredUsernameExtractor"),
        code: `function getUsername(name) {
    const container = [];
    container.push(name);
    const result = container[0];
    return result;
}`,
        codeHash: hash3,
        fixedCode: `function getUsername(name) {
  return name;
}`,
        language: "javascript",
        score: "2.0",
        summary: `Unnecessary container abuse`,
      },
      {
        title: "InfiniteIncompetence",
        slug: generateSlug("InfiniteIncompetence"),
        code: `def count_to_ten():
    i = 0
    while i < 10:
        print(i)
    i += 1 `,
        codeHash: hash4,
        fixedCode: `def count_to_ten():
    i = 0
    while i < 10:
        print(i)
        i += 1`,
        language: "python",
        score: "2.0",
        summary: `Code that goes nowhere, literally.`,
      },
      {
        title: "BooleanBungle",
        slug: generateSlug("BooleanBungle"),
        code: `public boolean isAuthorized(String status) {
    if (status.equals("true") == true) {
        return true;
    } else {
        return false;
    }
}`,
        codeHash: hash5,
        fixedCode: `public boolean isAuthorized(String status) {
    return Boolean.parseBoolean(status);
}`,
        language: "java",
        score: "2.0",
        summary: `Braindead boolean handling`,
      },
      {
        title: "DanglingPointerDisaster",
        slug: generateSlug("DanglingPointerDisaster"),
        code: `int* getLocalValue() {
    int tempValue = 42;
    return &tempValue; 
}`,
        codeHash: hash6,
        fixedCode: `int getLocalValue() {
    return 42;
}`,
        language: "c",
        score: "0.0",
        summary: `Return of the dangling pointer of doom!`,
      },
      {
        title: " SqlInjectionVortex",
        slug: generateSlug(" SqlInjectionVortex"),
        code: `<?php
$id = $_GET['id'];
$query = "SELECT * FROM users WHERE id = " . $id;
$result = $db->query($query);
?>`,
        codeHash: hash7,
        fixedCode: `$id = (int) $_GET['id'];
$query = "SELECT * FROM users WHERE id = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();`,
        language: "php",
        score: "0.0",
        summary: `SQL injection nightmare fueled by laziness`,
      },
      {
        title: "TypelessTerror",
        slug: generateSlug("TypelessTerror"),
        code: `function processData(input: any): any {
    const data: any = input as any;
    return data.value as any;
}`,
        codeHash: hash8,
        fixedCode: `function processData<T>(input: T): any {
  if ('value' in input) {
    return input.value;
  }
  throw new Error('Input does not contain a value property');
}`,
        language: "typescript",
        score: "2.0",
        summary: `Typeless catastrophe with reckless casting`,
      },
      {
        title: "ConfigCatastrophe",
        slug: generateSlug("ConfigCatastrophe"),
        code: `public void SaveConfig() {
    try {
        File.WriteAllText("config.json", "{'theme': 'dark'}");
    } catch (Exception e) {
    }
}`,
        codeHash: hash9,
        fixedCode: `public void SaveConfig() {
    try {
        string jsonData = "{"theme": "dark"}";
        File.WriteAllText("config.json", jsonData);
    } catch (Exception e) {
        Console.WriteLine("Error saving config: " + e.Message);
    }
}`,
        language: "csharp",
        score: "2.0",
        summary: `Saves config, ignores errors, and dreams of security`,
      },
    ])
    .onConflictDoNothing();

  const allRoasts = await db.query.roasts.findMany({
    where: (roasts, { inArray }) => inArray(roasts.codeHash, hashes),
  });

  const idMap = new Map<string, string>();
  for (const r of allRoasts) {
    idMap.set(r.codeHash, r.id);
  }

  const roastIds = hashes.map((h) => idMap.get(h) as string);

  // Clear existing issues for these roasts to prevent duplicates on multiple seed runs
  await db.delete(roastIssues).where(inArray(roastIssues.roastId, roastIds));

  await db.insert(roastIssues).values([
    {
      roastId: roastIds[0],
      title: "Unnecessary Variable Assignments",
      description: `In the calculate function, the variables 'a' and 'b' are assigned the values of 'val1' and 'val2' respectively, only to be used immediately after. This is not only unnecessary but also an affront to the very concept of efficiency. It's like paying for a sports car and then using it to pick up groceries from the store next door.`,
      severity: "error",
    },
    {
      roastId: roastIds[0],
      title: "Memory Leak Galore",
      description: `The DataProcessorManager class dynamically allocates memory for the 'buffer' array but fails to release it when the object is destroyed. This is a textbook example of a memory leak. It's like opening a faucet and then walking away, expecting the water to magically turn off itself. Newsflash: it won't, and neither will your memory leaks.`,
      severity: "error",
    },
    {
      roastId: roastIds[0],
      title: "Unused Objects and Functions",
      description: `The 'proc' object of type DataProcessorManager is created in the main function but its 'buffer' member is never used. The calculate function is also called but its return value is not utilized. This is akin to building a house and then never moving in, or writing a song and then never singing it. What's the point of even having it?`,
      severity: "warning",
    },
    {
      roastId: roastIds[1],
      title: "Redundant Operations",
      description: `Adding and subtracting the same number consecutively? Did a preschooler write this or are you trying to keep the CPU warm?`,
      severity: "error",
    },
    {
      roastId: roastIds[1],
      title: "Useless Comments",
      description: `'This does math' - no kidding, Sherlock. Next time, try writing code that explains itself instead of relying on captain obvious comments.`,
      severity: "warning",
    },
    {
      roastId: roastIds[1],
      title: "Variable Reassignment",
      description: `Constantly redefining 'c' instead of just doing the math in one step. It's like unpacking and packing a suitcase every time you need fresh socks.`,
      severity: "info",
    },
    {
      roastId: roastIds[2],
      title: "Useless useEffect",
      description: `Setting a state to the exact same value on mount. You just forced React to do a backflip for absolutely no reason.`,
      severity: "error",
    },
    {
      roastId: roastIds[2],
      title: "Unnecessary State",
      description: `If a value never changes, it's called a constant. Not everything needs to be wrapped in a useState hook, you absolute maniac.`,
      severity: "warning",
    },
    {
      roastId: roastIds[2],
      title: "Missing Imports",
      description: `Good luck running this without importing useState and useEffect. I'm guessing 'Cannot find name' is your favorite error.`,
      severity: "error",
    },
    {
      roastId: roastIds[3],
      title: "Unnecessary Array Usage",
      description: `Creating an array just to store and immediately retrieve a single value is an insult to the concept of arrays. It's like using a sledgehammer to crack a walnut, then wondering why your wall has a hole in it.`,
      severity: "error",
    },
    {
      roastId: roastIds[3],
      title: "Inefficient Variable Assignment",
      description: `Declaring a variable to store the result of an array access that's only used once is like hiring a personal assistant to hold your pencil for you. It's an egregious waste of resources and a slap in the face to the concept of simplicity.`,
      severity: "warning",
    },
    {
      roastId: roastIds[3],
      title: "Lack of Input Validation",
      description: `Not checking if the input 'name' is actually a string (or at least not null/undefined) before trying to use it is a rookie mistake. It's like building a house on quicksand and expecting it to stay upright during the first storm.`,
      severity: "error",
    },
    {
      roastId: roastIds[4],
      title: "Infinite Loop",
      description: `You managed to create a loop that doesn't actually loop due to the misplaced increment. Congrats, you've achieved a new level of incompetence.`,
      severity: "error",
    },
    {
      roastId: roastIds[4],
      title: "Logic Fail",
      description: `It seems you thought the loop condition would magically update the counter for you. Newsflash: it doesn't. You need to increment inside the loop, not after it.`,
      severity: "error",
    },
    {
      roastId: roastIds[4],
      title: "Lack of Basic Understanding",
      description: `This code reeks of a complete disregard for basic programming principles. Did you even try to run this before submitting it, or was this a half-hearted attempt at trying to look like you know what you're doing?`,
      severity: "warning",
    },
    {
      roastId: roastIds[5],
      title: "Pointless Comparison",
      description: `Using 'status.equals("true") == true' is like asking your mom if she's sure she's your mom. Just parse the boolean, genius.`,
      severity: "error",
    },
    {
      roastId: roastIds[5],
      title: "Redundant Conditional",
      description: `The if-else statement is a cringeworthy attempt at simplicity. It's like using a sledgehammer to crack a nut, but the nut is just a boolean value.`,
      severity: "warning",
    },
    {
      roastId: roastIds[5],
      title: "Lack of Input Validation",
      description: `This code assumes the input will always be a valid string representation of a boolean. Newsflash: it won't. Use a try-catch or some actual error handling for once.`,
      severity: "error",
    },
    {
      roastId: roastIds[6],
      title: "Dangling Pointer",
      description: `You're returning the address of a local variable, which is immediately destroyed when the function ends. This is like giving someone a map to a house that doesn't exist, but hey, at least you tried?`,
      severity: "error",
    },
    {
      roastId: roastIds[6],
      title: "Memory Safety",
      description: `Your code is a crash waiting to happen. The caller will try to access memory that's already been freed, causing a segfault or other undefined behavior. It's like playing a game of Russian roulette, but with pointers!`,
      severity: "error",
    },
    {
      roastId: roastIds[6],
      title: "Code Smell",
      description: `Why are you even returning a pointer to an int? Just return the int itself! This is like trying to solve a simple math problem with a blowtorch and a sledgehammer.`,
      severity: "warning",
    },
    {
      roastId: roastIds[7],
      title: "SQL Injection",
      description: `You're directly injecting user input into the SQL query. Congratulations, you've just opened the doors to a world of SQL injection attacks. Get a security book, or better yet, a career change.`,
      severity: "error",
    },
    {
      roastId: roastIds[7],
      title: "Lack of Input Sanitization",
      description: `Where's the input validation? Did you just assume users would play nice? Newsflash: they won't. Sanitize, validate, and for the love of security, use prepared statements.`,
      severity: "error",
    },
    {
      roastId: roastIds[7],
      title: "Potential Database Exposure",
      description: `Your code is a leak waiting to happen. With no error handling and a direct query execution, you're risking exposing your database credentials. Add some error handling, and consider using an ORM or a query builder.`,
      severity: "warning",
    },
    {
      roastId: roastIds[8],
      title: "Any Type Madness",
      description: `Using 'any' as a type is the coding equivalent of throwing a grenade into a room filled with kittens. It's a reckless disregard for safety, sanity, and the well-being of those who will maintain this code.`,
      severity: "error",
    },
    {
      roastId: roastIds[8],
      title: "Pointless Casting",
      description: `The input is cast to 'any' and then immediately assigned to another variable, also typed as 'any'. This is a masterclass in redundancy and a shining example of how to do nothing while appearing to be doing something.`,
      severity: "warning",
    },
    {
      roastId: roastIds[8],
      title: "Potential Null Pointer",
      description: `The code assumes that 'input.value' will always be defined, which is a bold assumption at best and a recipe for disaster at worst. What happens when 'input' is null or 'value' is undefined? The world may never know, but the error logs will be filled with the tears of the damned.`,
      severity: "error",
    },
    {
      roastId: roastIds[9],
      title: "Error Handling Disaster",
      description: `Catching all exceptions and doing absolutely nothing about it. This is like having a fire alarm that just silently observes the building burn to the ground.`,
      severity: "error",
    },
    {
      roastId: roastIds[9],
      title: "JSON String Literals",
      description: `Manually crafting JSON strings instead of using a proper serializer. This is an open invitation for encoding issues and vulnerabilities to come and play.`,
      severity: "warning",
    },
    {
      roastId: roastIds[9],
      title: "Lack of Config Flexibility",
      description: `Hardcoding the config data directly in the code. Because who needs flexibility or the ability to easily change settings, right? It's not like this will become a maintenance nightmare or anything.`,
      severity: "warning",
    },
  ]);
  console.log("✅ Seed completed successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Failed to seed database:", err);
  process.exit(1);
});
