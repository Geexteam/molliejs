"use strict";
const {wrap} = require('co');
const Mollie = require('../../mollie');

describe('Methods', () => {
    let check = 0;
    let method_id = null;

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

    describe('.list', () => {
        const offset = 0;

        describe('Basics', () => {
            it('Should be a function', () => {
                mollieOne.methods.list.should.be.a.Function();
            });
        });

        describe('Errors', () => {
            it('Should throw an error if a count of more than 250 is given', async () => {
                try {
                    await mollieOne.methods.list({count: 251});
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
                    const method = await mollieOne.methods.list({count: 15});
                    method.should.be.an.Object();
                    check = 1;
                } catch (error) {
                    console.log(error);
                    check = 2;
                }
                check.should.equal(1);
            });

            it('Should return certain fields', async () => {
                try {
                    const methods = await mollieOne.methods.list({count: 15});
                    methods.should.have.property('totalCount');
                    methods.should.have.property('offset');
                    methods.should.have.property('count');
                    methods.should.have.property('data');

                    method_id = methods.data[0].id;
                    check = 1;
                } catch (error) {
                    console.log(error);
                    check = 2;
                }
                check.should.equal(1);
            });

            it('Should return methods with method functions', async () => {
                try {
                    const methods = await mollieOne.methods.list({count: 15});
                    const method = methods.data[0];

                    method.should.have.property('getMinAmount');
                    method.should.have.property('getMaxAmount');
                    method.should.have.property('getImage');
                    method.should.have.property('getBiggerImage');

                    check = 1;
                } catch (error) {
                    console.log(error);
                    check = 2;
                }
                check.should.equal(1);
            });
        });
    });

    describe('.get', () => {

        describe('Basics', () => {
            it('Should be a function', () => {
                mollieOne.methods.get.should.be.a.Function();
            });
        });

        describe('Errors', () => {
            it('An Object should be thrown', async () => {
                try {
                    await mollieOne.methods.get();
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
                    await mollieOne.methods.get();
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
                    const method = await mollieOne.methods.get(method_id);
                    method.should.be.an.Object();
                    check = 1;
                } catch (error) {
                    console.log(error);
                    check = 2;
                }
                check.should.equal(1);
            });

            it('Should have basic properties', async () => {
                try {
                    const method = await mollieOne.methods.get(method_id);

                    method.should.have.property('id');
                    method.should.have.property('description');
                    method.should.have.property('amount');
                    method.should.have.property('image');
                    check = 1;
                } catch (error) {
                    console.log(error);
                    check = 2;
                }
                check.should.equal(1);
            });

            it('Should have function getMinAmount which returns the minimal amount', async () => {
                try {
                    const method = await mollieOne.methods.get(method_id);

                    method.should.have.property('getMinAmount');
                    const amount = method.getMinAmount();
                    amount.should.equal(method.amount.minimum)
                    check = 1;
                } catch (error) {
                    console.log(error);
                    console.log(error.stack);
                    check = 2;
                }
                check.should.equal(1);
            });

            it('Should have function getMaxAmount which returns the maximal amount', async () => {
                try {
                    const method = await mollieOne.methods.get(method_id);

                    method.should.have.property('getMaxAmount');
                    const amount = method.getMaxAmount();
                    amount.should.equal(method.amount.maximum);
                    check = 1;
                } catch (error) {
                    console.log(error);
                    console.log(error.stack);
                    check = 2;
                }
                check.should.equal(1);
            });

            it('Should have function getImage which returns the image', async () => {
                try {
                    const method = await mollieOne.methods.get(method_id);

                    method.should.have.property('getImage');
                    const image = method.getImage();
                    image.should.be.a.String();
                    image.should.equal(method.image.normal);
                    check = 1;
                } catch (error) {
                    console.log(error);
                    console.log(error.stack);
                    check = 2;
                }
                check.should.equal(1);
            });

            it('Should have function getBiggerImage which returns the bigger image', async () => {
                try {
                    const method = await mollieOne.methods.get(method_id);

                    method.should.have.property('getBiggerImage');
                    const image = method.getBiggerImage();
                    image.should.be.a.String();
                    image.should.equal(method.image.bigger);
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

});
