import { expect } from 'chai';

import { GridBank } from './grid-bank';
import { GridBankEasy } from './grid-bank-easy';
import { GridBankNormal } from './grid-bank-normal';
import { GridBankHard } from './grid-bank-hard';

class AllGridBanksTester {

    public easyBank = new GridBankEasy();
    public normalBank = new GridBankNormal();
    public hardBank = new GridBankHard();

    public fillupBanks(): Promise<[void, void, void]> {
        return Promise.all([
            this.easyBank.fillup(),
            this.normalBank.fillup(),
            this.hardBank.fillup()
        ]);
    }

    public getBankSizes(): [number, number, number] {
        return [
            this.easyBank.size,
            this.normalBank.size,
            this.hardBank.size
        ];
    }

}

describe('Grid Bank', () => {

    let banksTester: AllGridBanksTester;

    beforeEach(() => {
        banksTester = new AllGridBanksTester();
    });

    it('should fillup the bank of grid promises', async () => {

        banksTester.getBankSizes().forEach((size) => {
            expect(size).to.equal(0, 'Bank size is not zero when the server starts');
        });

        await banksTester.fillupBanks();
        banksTester.getBankSizes().forEach((size) => {
            expect(size).to.equal(GridBank.NUMBER_OF_GRIDS,
                'Bank is not filled to maximum capacity');
        });

    });

});
