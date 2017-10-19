export class PacketTest {
    constructor(
        public x: number,
        public flag: boolean,
        public str: string,
    ) { }
}

export class PacketTestTop {
    constructor(
        public o1: PacketTest,
        public o2: PacketTest,
        public o3: PacketTest,

        public x: number,
        public flag: boolean,
        public str: string,
        public flag2: boolean) { }
}