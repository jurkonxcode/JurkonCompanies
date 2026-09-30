// JurkonCompanies
// Market / Exchange Engine
// Version: 0.1

const MarketEngine = {

    listings: [],

    /*
     * ==========================================
     * LISTING
     * ==========================================
     */

    createListing({
        productId,
        sellerId,
        quantity,
        unitPrice,
        quality = 1
    }) {

        if (!productId) {
            throw new Error(
                "Product ID wajib diisi."
            );
        }

        if (!sellerId) {
            throw new Error(
                "Seller ID wajib diisi."
            );
        }

        if (quantity <= 0) {
            throw new Error(
                "Quantity harus lebih besar dari 0."
            );
        }

        if (unitPrice < 0) {
            throw new Error(
                "Harga tidak boleh negatif."
            );
        }

        const listing = {

            id: crypto.randomUUID(),

            productId,

            sellerId,

            quantity,

            unitPrice,

            quality,

            createdAt: Date.now(),

            status: "active"
        };

        this.listings.push(listing);

        GameEvents.emit(
            "market.listing.created",
            {
                listing
            }
        );

        return listing;
    },


    /*
     * ==========================================
     * QUERY
     * ==========================================
     */

    getListing(listingId) {

        return this.listings.find(
            listing =>
                listing.id === listingId
        ) || null;
    },


    getActiveListings(productId = null) {

        return this.listings.filter(
            listing => {

                if (
                    listing.status !== "active"
                ) {
                    return false;
                }

                if (
                    productId &&
                    listing.productId !== productId
                ) {
                    return false;
                }

                return listing.quantity > 0;
            }
        );
    },


    getListingsForProduct(productId) {

        return this.getActiveListings(
            productId
        );
    },


    /*
     * ==========================================
     * BUY VALIDATION
     * ==========================================
     */

    canBuy(
        listingId,
        quantity
    ) {

        const listing =
            this.getListing(listingId);

        if (!listing) {

            return {
                success: false,
                reason:
                    "Listing tidak ditemukan."
            };
        }

        if (
            listing.status !== "active"
        ) {

            return {
                success: false,
                reason:
                    "Listing tidak aktif."
            };
        }

        if (quantity <= 0) {

            return {
                success: false,
                reason:
                    "Quantity pembelian tidak valid."
            };
        }

        if (
            listing.quantity < quantity
        ) {

            return {
                success: false,
                reason:
                    "Quantity barang tidak mencukupi."
            };
        }

        const totalCost =
            listing.unitPrice * quantity;

        if (
            getCash() < totalCost
        ) {

            return {
                success: false,
                reason:
                    "Cash perusahaan tidak mencukupi."
            };
        }

        return {
            success: true,
            totalCost
        };
    },


    /*
     * ==========================================
     * BUY
     * ==========================================
     */

    buy(
        listingId,
        quantity = 1
    ) {

        const validation =
            this.canBuy(
                listingId,
                quantity
            );

        if (!validation.success) {

            GameEvents.emit(
                "market.purchase.failed",
                {
                    listingId,
                    quantity,
                    reason:
                        validation.reason
                }
            );

            return {
                success: false,
                reason:
                    validation.reason
            };
        }

        const listing =
            this.getListing(listingId);

        const totalCost =
            validation.totalCost;


        /*
         * --------------------------------------
         * CASH
         * --------------------------------------
         */

        const cashRemoved =
            removeCash(totalCost);

        if (!cashRemoved) {

            return {
                success: false,
                reason:
                    "Transaksi cash gagal."
            };
        }


        /*
         * --------------------------------------
         * INVENTORY
         * --------------------------------------
         */

        addInventory(
            listing.productId,
            quantity
        );


        /*
         * --------------------------------------
         * LISTING
         * --------------------------------------
         */

        listing.quantity -= quantity;

        if (
            listing.quantity <= 0
        ) {

            listing.quantity = 0;
            listing.status = "sold";
        }


        /*
         * --------------------------------------
         * TRANSACTION
         * --------------------------------------
         */

        const transaction = {

            id: crypto.randomUUID(),

            type: "market_purchase",

            listingId: listing.id,

            productId:
                listing.productId,

            buyerId:
                GameState.company.id,

            sellerId:
                listing.sellerId,

            quantity,

            unitPrice:
                listing.unitPrice,

            total:
                totalCost,

            quality:
                listing.quality,

            timestamp: Date.now()
        };


        /*
         * --------------------------------------
         * EVENT
         * --------------------------------------
         */

        GameEvents.emit(
            "market.purchase.completed",
            {
                transaction,
                listing
            }
        );


        console.log(
            "Market purchase completed:",
            transaction
        );


        return {
            success: true,
            transaction
        };
    },


    /*
     * ==========================================
     * SELL
     * ==========================================
     */

    canSell(
        productId,
        quantity,
        unitPrice
    ) {

        if (!productId) {

            return {
                success: false,
                reason:
                    "Product ID wajib diisi."
            };
        }

        if (quantity <= 0) {

            return {
                success: false,
                reason:
                    "Quantity penjualan tidak valid."
            };
        }

        if (unitPrice < 0) {

            return {
                success: false,
                reason:
                    "Harga tidak boleh negatif."
            };
        }

        if (
            !hasInventory(
                productId,
                quantity
            )
        ) {

            return {
                success: false,
                reason:
                    "Inventory tidak mencukupi."
            };
        }

        return {
            success: true
        };
    },


    sell(
        productId,
        quantity,
        unitPrice,
        quality = 1
    ) {

        const validation =
            this.canSell(
                productId,
                quantity,
                unitPrice
            );

        if (!validation.success) {

            GameEvents.emit(
                "market.sale.failed",
                {
                    productId,
                    quantity,
                    unitPrice,
                    reason:
                        validation.reason
                }
            );

            return {
                success: false,
                reason:
                    validation.reason
            };
        }


        /*
         * --------------------------------------
         * REMOVE INVENTORY
         * --------------------------------------
         */

        const removed =
            removeInventory(
                productId,
                quantity
            );

        if (!removed) {

            return {
                success: false,
                reason:
                    "Inventory gagal dikurangi."
            };
        }


        /*
         * --------------------------------------
         * CREATE LISTING
         * --------------------------------------
         */

        const listing =
            this.createListing({

                productId,

                sellerId:
                    GameState.company.id,

                quantity,

                unitPrice,

                quality
            });


        /*
         * --------------------------------------
         * EVENT
         * --------------------------------------
         */

        GameEvents.emit(
            "market.sale.listed",
            {
                listing
            }
        );


        console.log(
            "Market sale listed:",
            listing
        );


        return {
            success: true,
            listing
        };
    },


    /*
     * ==========================================
     * CANCEL LISTING
     * ==========================================
     */

    cancelListing(listingId) {

        const listing =
            this.getListing(listingId);

        if (!listing) {
            return false;
        }

        if (
            listing.status !== "active"
        ) {
            return false;
        }


        /*
         * Return inventory
         */

        addInventory(
            listing.productId,
            listing.quantity
        );


        listing.status = "cancelled";


        GameEvents.emit(
            "market.listing.cancelled",
            {
                listing
            }
        );


        return true;
    },


    /*
     * ==========================================
     * MARKET STATISTICS
     * ==========================================
     */

    getLowestPrice(productId) {

        const listings =
            this.getListingsForProduct(
                productId
            );

        if (
            listings.length === 0
        ) {
            return null;
        }

        return Math.min(
            ...listings.map(
                listing =>
                    listing.unitPrice
            )
        );
    },


    getTotalAvailable(productId) {

        return this
            .getListingsForProduct(
                productId
            )
            .reduce(
                (total, listing) =>
                    total + listing.quantity,
                0
            );
    }
};


/*
 * ==========================================
 * MARKET EVENTS
 * ==========================================
 */

GameEvents.on(
    "market.purchase.completed",
    data => {

        console.log(
            `Membeli ${data.transaction.quantity} ` +
            `${data.transaction.productId} ` +
            `seharga $${data.transaction.total}.`
        );
    }
);


GameEvents.on(
    "market.sale.listed",
    data => {

        console.log(
            `Menjual ${data.listing.quantity} ` +
            `${data.listing.productId} ` +
            `seharga $${data.listing.unitPrice} / unit.`
        );
    }
);
TransactionEngine.record({

    type: "market_purchase",

    category: "inventory",

    amount: totalCost,

    productId:
        listing.productId,

    quantity,

    metadata: {

        listingId:
            listing.id,

        sellerId:
            listing.sellerId,

        unitPrice:
            listing.unitPrice,

        quality:
            listing.quality
    }
});
