const denied = require('obj-denied');
const {assign} = Object;

const paymentFunctions = {
    /**
     * Returns the paymentUrl you redirect the user to, so they can pay the order
     * @returns {String} The paymentUrl
     */
    getPaymentUrl() {
        return this.links.paymentUrl;
    },
    /**
     * Returns a boolean stating the order is paid or not
     * @returns {Boolean} Order is paid or not
     */
    isPaid() {
        return ['paid', 'paidout'].indexOf(this.status.toLowerCase()) > -1;
    }
};

/**
 * Creates a new payment
 * @param {Number} amount The amount to be paid
 * @param {String} description The description for the payment
 * @param {String} redirectUrl The URL Mollie should redirect the user to when done (canceled, paid, etc.)
 * @param {Object} options Options Mollie accepts for Payment.Create
 * @returns {Object} New Payment or error, created by Mollie
 */
async function create(amount, description, redirectUrl, options) {
    if (!amount || !description || !redirectUrl) {
        throw {error: 'Not all required parameters are given'};
    }

    if (options) {
        if (!denied(options, 'recurringType') && denied(options, 'customerId')) {
            throw {error: 'You need a customerId if you want to use recurring payments'};
        }
        if (!denied(options, 'recurringType') && ['first', 'recurring'].indexOf(options.recurringType) === -1) {
            throw {error: 'recurringType needs value "first" or "recurring"'};
        }
    }

    const opts = assign({
        amount,
        description,
        redirectUrl
    }, options);

    const result = await this.request(
        'POST',
        'payments',
        opts
    );

    if (result.error) {
        throw result;
    } else {
        readifyPayments(result);
        return result;
    }
}

/**
 * Get information about a payment from Mollie by it's id
 * @param {String} id The payments id
 * @returns {Object} Payment information or error, given by Mollie
 */
async function get(id) {
    if (!id) {
        throw {error: 'No id is given'};
    }

    const result = await this.request(
        'GET',
        `payments/${id}`
    );

    if (result.error) {
        throw result;
    } else {
        readifyPayments(result);
        return result;
    }
}

/**
 * Retrieves a list of payments from Mollie
 * @param {Object} options Options Mollie accepts for Payment.List
 * @returns {Object} List of payments along with some other data
 */
async function list(options = {}) {
    if (!denied(options, 'count') && options.count > 250) {
        throw {error: 'Count larger than 250 is not allowed'};
    }

    const result = await this.request(
        'GET',
        'payments',
        null,
        options
    );

    if (result.error) {
        throw result;
    } else {
        readifyPayments(result.data);
        return result;
    }
}

function readifyPayments(payments) {
    if (payments.constructor === Object) {
        assign(payments, paymentFunctions);
    } else {
        for (let i = 0; i < payments.length; i++) {
            assign(payments[i], paymentFunctions);
        }
    }
}

module.exports = {
    create,
    get,
    list
};
