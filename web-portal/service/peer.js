class PeerService {
  constructor() {
    if (typeof window !== 'undefined' && window.RTCPeerConnection) {
      if (!this.peer) {
        this.peer = new RTCPeerConnection({
          iceServers: [
            {
              urls: [
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
                "stun:global,stun.twilio.com:3478",
              ],
            },
          ],
        });
      }
    } else {
      window.alert("WebRTC is not supported in your browser");
    }
  }

  async getAnswer(offer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(offer);
      const answer = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(answer));
      return answer;
    }
  }

  async setLocalDescription(answer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }

  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }
}

export default (typeof window !== "undefined") ? new PeerService() : null;
// export default new PeerService();