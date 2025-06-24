const axios2 = require("axios");

const BACKEND_URL = "http://localhost:3000"
const WS_URL = "ws://localhost:3000"

const axios = {
    post: async (...args) => {
        try {
            const res = await axios2.post(...args)
            return res
        } catch (e) {
            return e.response
        }
    },
    get: async (...args) => {
        try {
            const res = await axios2.get(...args)
            return res
        } catch (e) {
            return e.response
        }
    },
    put: async (...args) => {
        try {
            const res = await axios2.put(...args)
            return res
        } catch (e) {
            return e.response
        }
    },
    delete: async (...args) => {
        try {
            const res = await axios2.delete(...args)
            return res
        } catch (e) {
            return e.response
        }
    },
}
describe('Trade Endpoints', () => {
    test('should echo', async () => {
        const res = await axios.get(BACKEND_URL + '/trade/echo')
        expect(res.data.ok).toBe(true);
        expect(res.data.msg).toBe('echo success');
    });

    test('should reject buy if not enough cash', async () => {
        const res = await axios.post(BACKEND_URL + '/trade/makeorder', { side: 'bid', price: 500, quantity: 3, userId: '1' });
        expect(res.data.ok).toBe(false);
    });

    test('should reject sell if not enough stock', async () => {
        const res = await axios.post(BACKEND_URL + '/trade/makeorder', { side: 'ask', price: 100, quantity: 8, userId: '2' });
        expect(res.data.ok).toBe(false);
    });

    test('should place a bid order and match/settle', async () => {
        const sell = await axios.post(BACKEND_URL + '/trade/makeorder', { side: 'ask', price: 100, quantity: 2, userId: '1' });
        const buy = await axios.post(BACKEND_URL + '/trade/makeorder', { side: 'bid', price: 100, quantity: 2, userId: '2' });
        expect(buy.data.ok).toBe(true);
        expect(buy.data.msg).toMatch(/All quantity of 2 is filled/);
    });

    test('should place an ask order and match/settle', async () => {
        const buy = await axios.post(BACKEND_URL + '/trade/makeorder', { side: 'bid', price: 100, quantity: 2, userId: '3' });
        const sell = await axios.post(BACKEND_URL + '/trade/makeorder', { side: 'ask', price: 100, quantity: 2, userId: '2' });
        expect(sell.data.ok).toBe(true);
        expect(sell.data.msg).toMatch(/All quantity of 2 is filled/);
    });
}); 