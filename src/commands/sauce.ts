import BaseCommand from "../abstracts/BaseCommand";
import Bot from "../bot";
import { Message, MessageEmbed } from "discord.js";
import axios from "axios";

interface SauceNaoResults {
  header: {
    similarity: string;
    thumbnail: string;
    index_id: number;
    index_name: string;
    dupes: number;
  };
  data: {
    ext_urls: string[];
    title: string;
    da_id: string;
    author_name: string;
    author_url: string;
    source: string;
    anidb_aid: number;
    part: string;
    year: string;
    est_time: string;
    danbooru_id: number;
    gelbooru_id: number;
    creator: string;
    material: string;
    characters: string;
    pixiv_id: number;
  };
}

interface SauceNaoResponse {
  header: {
    user_id: string;
    account_type: 1;
    short_limit: string;
    long_limit: string;
    log_remaining: number;
    short_remaining: number;
    status: number;
    results_requested: number;
    index: object;
    search_depth: string;
    minimum_similarity: number;
    query_image_display: string;
    query_image: string;
    results_returned: number;
  };
  results: SauceNaoResults[];
}

export default class SauceCommand extends BaseCommand {
  constructor() {
    super("sauce", "misc", [], false);
  }

  async execute(bot: Bot, message: Message): Promise<void> {
    if (!Object.keys(message.mentions.users).length && !message.reference) return;

    const messageId = message.reference.messageID;

    const mentionedMessage = await message.channel.messages.fetch(messageId);

    const file = mentionedMessage.embeds.length
      ? mentionedMessage.embeds[0].url
      : mentionedMessage.attachments.size && mentionedMessage.attachments.first().url;

    if (!file) {
      message.channel.send("`Oops, the mentioned message is not an image.`");
      return;
    }

    const { data } = await axios.get<SauceNaoResponse>(
      `https://saucenao.com/search.php?db=999&output_type=2&testmode=1&numres=16&url=${file}&api_key=SAUCENAO_API_KEY`
    );

    const sauce = data.results[0]; // sauce with higher similarity

    if (parseInt(sauce.header.similarity) < data.header.minimum_similarity) {
      message.channel.send("`Low similarity. Results have been hidden.`");
      return;
    }

    const sauceLink = sauce.data.gelbooru_id
      ? `https://gelbooru.com/index.php?page=post&s=view&id=${sauce.data.gelbooru_id}`
      : sauce.data.danbooru_id
      ? `https://danbooru.donmai.us/posts/${sauce.data.danbooru_id}`
      : sauce.data.pixiv_id &&
        `https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${sauce.data.pixiv_id}`;

    const embedSauce = new MessageEmbed()
      .setColor('#ff6781')
      .setTitle("Sauce Result")
      .addField("Similarity", sauce.header.similarity)
      .addField("Source", sauce.data.source || sauce.data.title || sauce.data.material || "Unknown");

    if (sauce.data.characters) embedSauce.addField("Characters", sauce.data.characters);
    if (sauce.data.creator) embedSauce.addField("Creator", sauce.data.creator);
    if (sauce.data.danbooru_id || sauce.data.gelbooru_id || sauce.data.pixiv_id) {
      embedSauce.addField("Link", sauceLink);
      embedSauce.setImage(sauce.header.thumbnail);
    }

    message.channel.send(embedSauce);
  }
}
