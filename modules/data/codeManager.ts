import fs from "fs";
import path from "path";
import { User } from "discord.js";

const dataFile = path.resolve("./data/codes.json");
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([]));
}

type Code = {
  code: string;
  owner: string;
  descriminator: string;
  id: string;
  created: number;
};

type CodeFile = Code[];

export default class CodeManager {
  private static getCodeFile(): CodeFile {
    const data = fs.readFileSync(dataFile, "utf8");
    return JSON.parse(data) as CodeFile;
  }

  private static saveCodeFile(codeFile: CodeFile): void {
    fs.writeFileSync(dataFile, JSON.stringify(codeFile));
  }

  private static removeCode(code: string): void {
    const codeFile = this.getCodeFile();
    const index = codeFile.findIndex((c) => c.code === code.toString());
    codeFile.splice(index, 1);
    this.saveCodeFile(codeFile);
  }

  private static genCode(): string {
    this.removeOutdatedCodes();
    const codeList: number[] = this.getCodeFile().map((code) => parseInt(code.code));
    let code = "";
    do {
      code = Math.floor(Math.random() * 10000).toString();
    } while (codeList.includes(parseInt(code)));

    if (code.length < 4) {
      code = "0".repeat(4 - code.length) + code;
    }

    return code;
  }

  private static removeOutdatedCodes(): void {
    // Remove codes that are older than 30 minutes
    const codeFile = this.getCodeFile();
    const newCodeFile = codeFile.filter((code) => Date.now() - code.created < 1800000);
    this.saveCodeFile(newCodeFile);
  }

  public static newCode(user: User): string {
    const codeFile = this.getCodeFile();
    const code = this.genCode();
    codeFile.push({
      code,
      owner: user.username,
      descriminator: user.discriminator,
      id: user.id,
      created: Date.now(),
    });
    this.saveCodeFile(codeFile);
    return code;
  }

  public static getCode(code: string): Code | undefined {
    const codeObj = this.getCodeFile().find((c) => c.code === code);
    if (!code) {
      return;
    } else {
      this.removeCode(code);
      return codeObj;
    }
  }
}
