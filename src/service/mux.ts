import Mux from "@mux/mux-node";

class MuxService {
  private mux;
  constructor() {
    this.mux = new Mux({
      tokenId: process.env.MUX_ACCESS_TOKEN_ID!,
      tokenSecret: process.env.MUX_SECRET_KEY!,
    });
  }

  async getVideoAssets() {
    return this.mux.video.assets;
  }

  async deleteVideo(asset_id: string) {
    if (asset_id) await this.mux.video.assets.delete(asset_id);
  }

  async createVideoAsset(videoInput: string) {
    return await this.mux.video.assets.create({
      input: [{ url: videoInput }],
      test: false,
      playback_policy: ["public"],
    });
  }
}

const MuxServiceInstance = new MuxService();

export default MuxServiceInstance;
