
const products = [
    {
        id: 'product1',
        name: 'Product 1',
        supplier: '1',
        price: '100',
        image: 'product-01.jpg',
        description: 'This is Product 1 of Step to Future. It just for testing !!',
        versions: [
            {
                id: 'version1',
                versionName: 'Version 1',
                retailPrice: '100',
                attributes: [
                    {
                        id: 'attribute1',
                        key: 'Color',
                        value: 'Red'
                    },
                    {
                        id: 'attribute1',
                        key: 'Size',
                        value: 'Small'
                    }
                ],
                images: [
                    'product-detail-01.jpg',
                    'product-detail-02.jpg'
                ]
            },
            {
                id: 'version2',
                versionName: 'Version 2',
                retailPrice: '105',
                attributes: [
                    {
                        id: 'attribute1',
                        key: 'Color',
                        value: 'Red'
                    },
                    {
                        id: 'attribute1',
                        key: 'Size',
                        value: 'Medium'
                    }
                ],
                images: []
            },
            {
                id: 'version3',
                versionName: 'Version 3',
                retailPrice: '100',
                attributes: [
                    {
                        id: 'attribute1',
                        key: 'Color',
                        value: 'Blue'
                    },
                    {
                        id: 'attribute1',
                        key: 'Size',
                        value: 'Small'
                    }
                ],
                images: [
                    'product-detail-03.jpg'
                ]
            }
        ]
    },
    {
        id: 'product2',
        name: 'Product 2',
        supplier: '1',
        price: '110',
        image: 'product-02.jpg',
        description: 'This is Product 2 of Step to Future. It just for testing !!',
        versions: [
            {
                id: 'version4',
                versionName: 'Version 4',
                retailPrice: '110',
                attributes: [
                    {
                        id: 'attribute1',
                        key: 'Color',
                        value: 'Green'
                    },
                    {
                        id: 'attribute1',
                        key: 'Size',
                        value: 'Small'
                    }
                ],
                images: []
            },
            {
                id: 'version5',
                versionName: 'Version 5',
                retailPrice: '115',
                attributes: [
                    {
                        id: 'attribute1',
                        key: 'Color',
                        value: 'Green'
                    },
                    {
                        id: 'attribute1',
                        key: 'Size',
                        value: 'Medium'
                    }
                ],
                images: []
            },
            {
                id: 'version6',
                versionName: 'Version 6',
                retailPrice: '110',
                attributes: [
                    {
                        id: 'attribute1',
                        key: 'Color',
                        value: 'Yellow'
                    },
                    {
                        id: 'attribute1',
                        key: 'Size',
                        value: 'Small'
                    }
                ],
                images: []
            }
        ]
    }
];

export default products;
