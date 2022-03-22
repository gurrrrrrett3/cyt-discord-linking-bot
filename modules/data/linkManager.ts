import fs from "fs";
import path from "path";
import { User } from "discord.js";
import CodeManager from "./codeManager";

const dataFile = path.resolve("./data/links.json");
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify([]));
}

type Link = {
  username: string;
  uuid: string;
  id: string;
};

type LinkFile = Link[];

type NewLinkReturn = {
  success: boolean;
  message: string;
};

export default class LinkManager {
  private static getLinkFile(): LinkFile {
    const data = fs.readFileSync(dataFile, "utf8");
    return JSON.parse(data) as LinkFile;
  }

  private static saveLinkFile(linkFile: LinkFile): void {
    fs.writeFileSync(dataFile, JSON.stringify(linkFile));
  }

  public static removeLink(id: string): void {
    const linkFile = this.getLinkFile();
    const index = linkFile.findIndex((l) => l.id === id);
    linkFile.splice(index, 1);
    this.saveLinkFile(linkFile);
  }

  public static removeLinkByID(id: string): void {
    const linkFile = this.getLinkFile();
    const index = linkFile.findIndex((l) => l.uuid === id);
    linkFile.splice(index, 1);
    this.saveLinkFile(linkFile);
  }

  public static newLink(uuid: string, username: string, code: string): NewLinkReturn {
    const codeData = CodeManager.getCode(code);
    if (!codeData) {
      return {
        success: false,
        message: "Code not found",
      };
    }

    const linkFile = this.getLinkFile();
    const link = {
      username,
      uuid,
      id: codeData.id,
    };

    linkFile.push(link);
    this.saveLinkFile(linkFile);
    return {
      success: true,
      message: `Your account has been linked to ${codeData.owner}#${codeData.descriminator} (${codeData.id})`,
    };
  }
}
