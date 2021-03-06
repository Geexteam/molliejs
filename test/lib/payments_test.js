"use strict";
const {wrap} = require('co');
const Mollie = require('../../mollie');

describe('Payments', () => {
    let check = 0;
    let payment_id = null;

    let mollieOne;
    let keys;

    before(() => {
        if (process.env.MOLLIE_KEY)
            keys = [{key: process.env.MOLLIE_KEY}];
        else
            keys = require(`${process.env.TEST_DIR}/test_keys`);
    });

    beforeEach(() => {
        check = 0;
        mollieOne = new Mollie(keys[0].key);
    });

    describe('.create', () => {
        const amount = 10.00;
        const description = 'Mollie ES6 module Test';
        const redirectUrl = 'http://example.org/order/12345';

        describe('Basics', () => {
            it('Should be a function', () => {
                mollieOne.payments.create.should.be.a.Function();
            });
        });

        describe('Errors', () => {
            it('An Object should be thrown', async () => {
                try {
                    await mollieOne.payments.create();
                    check = 1;
                } catch (error) {
                    error.should.be.an.Object();
                    error.should.have.property('error');
                    check = 2;
                }
                check.should.equal(2);
            });

            it('Should throw an error if no amount is given', async () => {
                try {
                    await mollieOne.payments.create(null, description, redirectUrl);
                    check = 1;
                } catch (error) {
                    error.should.have.property('error', 'Not all required parameters are given');
                    check = 2;
                }
                check.should.equal(2);
            });

            it('Should throw an error if no description is given', async () => {
                try {
                    await mollieOne.payments.create(amount, null, redirectUrl);
                    check = 1;
                } catch (error) {
                    error.should.have.property('error', 'Not all required parameters are given');
                    check = 2;
                }
                check.should.equal(2);
            });

            it('Should throw an error if no redirectUrl is given', async () => {
                try {
                    await mollieOne.payments.create(amount, description);
                    local.should.equal(false);
                    check = 1;
                } catch (error) {
                    error.should.have.property('error', 'Not all required parameters are given');
                    check = 2;
                }
                check.should.equal(2);
            });

            it('Should throw an error if recurringType is set, but no customerID', async () => {
                try {
                    const payment = await mollieOne.payments.create(
                        amount,
                        description,
                        redirectUrl,
                        {recurringType: 'first'}
                    );
                    payment.should.be.an.Object();
                    check = 1;
                } catch (error) {
                    error.should.have.property('error');
                    check = 2;
                }
                check.should.equal(2);
            });

            it('Should throw an error if recurringType is not "first" or "recurring"', async () => {
                try {
                    const payment = await mollieOne.payments.create(
                        amount,
                        description,
                        redirectUrl,
                        {
                            recurringType: 'amazing!!',
                            customerId: 'John Cena'
                        }
                    );
                    payment.should.be.an.Object();
                    check = 1;
                } catch (error) {
                    error.should.have.property('error');
                    check = 2;
                }
                check.should.equal(2);
            });
        });

        describe('Success', () => {
            it('Should return an Object', async () => {
                try {
                    const payment = await mollieOne.payments.create(amount, description, redirectUrl);
                    payment.should.be.an.Object();
                    check = 1;
                } catch (error) {
                    console.log(error);
                    check = 2;
                }
                check.should.equal(1);
            });

            it('Should have basic properties', async () => {
                try {
                    const payment = await mollieOne.payments.create(amount, description, redirectUrl);

                    payment.should.have.property('id');
                    payment.should.have.property('status');
                    payment.should.have.property('amount');
                    payment.should.have.property('description');
                    check = 1;
                } catch (error) {
                    console.log(error);
                    check = 2;
                }
                check.should.equal(1);
            });

            it('Should have function getPaymentUrl which returns the paymentUrl', async () => {
                try {
                    const payment = await mollieOne.payments.create(amount, description, redirectUrl);
                    payment.should.have.property('getPaymentUrl');
                    const url = payment.getPaymentUrl();
                    url.should.be.an.String();
                    url.should.equal(payment.links.paymentUrl)
                    check = 1;
                } catch (error) {
                    console.log(error);
                    console.log(error.stack);
                    check = 2;
                }
                check.should.equal(1);
            });

            it('Should have function isPaid which returns false', async () => {
                try {
                    const payment = await mollieOne.payments.create(amount, description, redirectUrl);
                    payment.should.have.property('isPaid');
                    const paid = payment.isPaid();
                    paid.should.be.a.Boolean();
                    paid.should.equal(false);
                    payment_id = payment.id;
                    check = 1;
                } catch (error) {
                    console.log(error);
                    console.log(error.stack);
                    check = 2;
                }
                check.should.equal(1);
            });
        });
    });

    describe('.get', () => {

        describe('Basics', () => {
            it('Should be a function', () => {
                mollieOne.payments.get.should.be.a.Function();
            });
        });

        describe('Errors', () => {
            it('An Object should be thrown', async () => {
                try {
                    await mollieOne.payments.get();
                    check = 1;
                } catch (error) {
                    error.should.be.an.Object();
                    error.should.have.property('error');
                    check = 2;
                }
                check.should.equal(2);
            });

            it('Should throw an error if no id is given', async () => {
                try {
                    await mollieOne.payments.get();
                    check = 1;
                } catch (error) {
                    error.should.have.property('error', 'No id is given');
                    check = 2;
                }
                check.should.equal(2);
            });
        });

        describe('Success', () => {
            it('Should return an Object', async () => {
                try {
                    const payment = await mollieOne.payments.get(payment_id);
                    payment.should.be.an.Object();
                    check = 1;
                } catch (error) {
                    console.log(error);
                    check = 2;
                }
                check.should.equal(1);
            });

            it('Should have basic properties', async () => {
                try {
                    const payment = await mollieOne.payments.get(payment_id);

                    payment.should.have.property('id');
                    payment.should.have.property('status');
                    payment.should.have.property('amount');
                    payment.should.have.property('description');
                    check = 1;
                } catch (error) {
                    console.log(error);
                    check = 2;
                }
                check.should.equal(1);
            });

            it('Should have function getPaymentUrl which returns the paymentUrl', async () => {
                try {
                    const payment = await mollieOne.payments.get(payment_id);

                    payment.should.have.property('getPaymentUrl');
                    const url = payment.getPaymentUrl();
                    url.should.be.an.String();
                    url.should.equal(payment.links.paymentUrl)
                    check = 1;
                } catch (error) {
                    console.log(error);
                    console.log(error.stack);
                    check = 2;
                }
                check.should.equal(1);
            });

            it('Should have function isPaid, with various outcomes based on the status', async () => {
                try {
                    let payment = await mollieOne.payments.get(payment_id);
                    payment.should.have.property('isPaid');
                    let paid = payment.isPaid();
                    paid.should.be.a.Boolean();
                    paid.should.equal(false);

                    payment.status = 'paid';
                    paid = payment.isPaid();
                    paid.should.be.a.Boolean();
                    paid.should.equal(true);

                    payment.status = 'paidout';
                    paid = payment.isPaid();
                    paid.should.be.a.Boolean();
                    paid.should.equal(true);

                    payment.status = 'expired';
                    paid = payment.isPaid();
                    paid.should.be.a.Boolean();
                    paid.should.equal(false);

                    check = 1;
                } catch (error) {
                    console.log(error);
                    console.log(error.stack);
                    check = 2;
                }
                check.should.equal(1);
            });
        });
    });


    describe('.list', () => {
        const offset = 2;
        const count = 'Mollie ES6 module Test';

        describe('Basics', () => {
            it('Should be a function', () => {
                mollieOne.payments.list.should.be.a.Function();
            });
        });

        describe('Errors', () => {
            it('Should throw an error if a count of more than 250 is given', async () => {
                try {
                    await mollieOne.payments.list({count: 251});
                    check = 1;
                } catch (error) {
                    error.should.have.property('error', 'Count larger than 250 is not allowed');
                    check = 2;
                }
                check.should.equal(2);
            });
        });

        describe('Success', () => {
            it('Should return an Object', async () => {
                try {
                    const payment = await mollieOne.payments.list({count: 15});
                    payment.should.be.an.Object();
                    check = 1;
                } catch (error) {
                    console.log(error);
                    check = 2;
                }
                check.should.equal(1);
            });

            it('Should return certain fields', async () => {
                try {
                    const count = 10, offset = 2;
                    const payment = await mollieOne.payments.list({count, offset});
                    payment.should.have.property('totalCount');
                    payment.should.have.property('offset', offset);
                    payment.should.have.property('count');
                    payment.should.have.property('data');
                    check = 1;
                } catch (error) {
                    console.log(error);
                    check = 2;
                }
                check.should.equal(1);
            });

            it('Should return payments with payment functions', async () => {
                try {
                    const payments = await mollieOne.payments.list({count: 15});
                    const payment = payments.data[0];

                    payment.should.have.property('getPaymentUrl');
                    payment.should.have.property('isPaid');

                    check = 1;
                } catch (error) {
                    console.log(error);
                    check = 2;
                }
                check.should.equal(1);
            });

            it('Should work without parameters', async () => {
                try {
                    const payment = await mollieOne.payments.list();

                    payment.should.have.property('totalCount');
                    payment.should.have.property('offset');
                    payment.should.have.property('count');
                    payment.should.have.property('data');

                    check = 1;
                } catch (error) {
                    console.log(error);
                    check = 2;
                }
                check.should.equal(1);
            });
        });
    });

});
