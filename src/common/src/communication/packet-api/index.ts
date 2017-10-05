export * from './packet-manager-base';
export * from './packet-parser';
export * from './packet-event';
export * from './packet-handler';

import { PacketManagerBase, Socket } from './packet-manager-base';

// Export the right packet Manager
// tslint:disable-next-line:variable-name
let PacketManager: PacketManagerBase<Socket>;
if (process.env.npm_package_config_packetapi_mgr === 'server') {
    try {
        PacketManager = require('./packet-manager').PacketManagerServer;
    } catch (error) {
        console.error('Cannot export PacketManager for Server [%s]', error.message);
        process.exit(1);
    }
}
if (process.env.npm_package_config_packetapi_mgr === 'client') {
    try {
        PacketManager = require('./packet-manager-client').PacketManagerClient;
    } catch (error) {
        console.error('Cannot export PacketManager for Client [%s]', error.message);
        process.exit(1);
    }
}
exports.PacketManager = PacketManager as PacketManagerBase<Socket>;
declare type PacketManager = PacketManagerBase<Socket>;
