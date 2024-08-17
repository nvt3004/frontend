package com.models;

import java.util.List;

import lombok.Data;

@Data
public class AttributeDTO  {
    private List<ColorDTO> colors;
    private List<SizeDTO> sizes;
    
    private String color;
    private String size;

    public AttributeDTO(List<ColorDTO> colors, List<SizeDTO> sizes) {
		this.colors = colors;
		this.sizes = sizes;
	}

	public AttributeDTO(String color, String size) {
		this.color = color;
		this.size = size;
	}
}