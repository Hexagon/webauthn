import { Webauthn } from "../common/main.js";
import { ToolBox } from "./toolbox.js";

class WebauthnFactory {
	constructor(opts) {
		return new Webauthn(opts, ToolBox);
	}
}

WebauthnFactory.Webauthn = WebauthnFactory;
export default WebauthnFactory;
export { WebauthnFactory as Webauthn };