"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
function isJson(pseudoJson) {
    try {
        JSON.parse(pseudoJson);
        return true;
    }
    catch (error) {
        if (error instanceof SyntaxError) {
            return false;
        }
        throw error;
    }
}
exports.isJson = isJson;
__export(require("./prefixable-console"));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvdm9pZC9jb2RlL3BvbHlfdHAvbG9nMjk5MC0wMS9zcmMvY29tbW9uL3NyYy8iLCJzb3VyY2VzIjpbInV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsZ0JBQXVCLFVBQWtCO0lBQ3JDLElBQUksQ0FBQztRQUNELElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNiLEVBQUUsQ0FBQyxDQUFDLEtBQUssWUFBWSxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQy9CLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUNELE1BQU0sS0FBSyxDQUFDO0lBQ2hCLENBQUM7QUFDTCxDQUFDO0FBVkQsd0JBVUM7QUFFRCwwQ0FBcUMifQ==