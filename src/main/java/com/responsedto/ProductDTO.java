package com.responsedto;


import java.util.List;

public class ProductDTO {
    private String objectID;
    private String id;
    private String name;
    private String description;
    private int quantity;
    private double price;
    private double discountedPrice;
    private double rating;
    private List<ColorOption> versionProduct;
    private List<String> category;
    private String brand;

    private boolean status;

    // Getters and setters for all fields

    // Inner class for color options
    public static class ColorOption {
        private String colorName;
        private List<String> sizes;
        private String image;

        // Getters and setters
    }
}
