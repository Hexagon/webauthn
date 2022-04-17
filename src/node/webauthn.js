import { ToolBoxRegistration } from "./toolbox.js";
ToolBoxRegistration.registerAsGlobal();

import { Webauthn } from "../common/main.js";

Webauthn.Webauthn = Webauthn;
export default Webauthn;
export { Webauthn }; 