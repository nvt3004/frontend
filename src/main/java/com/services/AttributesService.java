package com.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.entities.AttributeOptionsVersion;
import com.entities.ProductVersion;
import com.models.AttributeDTO;
import com.repositories.ProductVersionJPA;

@Service
public class AttributesService {
    @Autowired
    private ProductVersionJPA productVersionRepository;

    public AttributeDTO getAttributesByProductVersionId(Integer productVersionId) {
        ProductVersion productVersion = productVersionRepository.findById(productVersionId)
                .orElseThrow(() -> new RuntimeException("ProductVersion not found"));

        String color = null;
        String size = null;

        for (AttributeOptionsVersion aov : productVersion.getAttributeOptionsVersions()) {
            String attributeName = aov.getAttributeOption().getAttribute().getAttributeName();
            String attributeValue = aov.getAttributeOption().getAttributeValue();

            if ("Color".equalsIgnoreCase(attributeName) && color == null) {
                color = attributeValue;
            } else if ("Size".equalsIgnoreCase(attributeName) && size == null) {
                size = attributeValue;
            }

            if (color != null && size != null) {
                break;
            }
        }

        return new AttributeDTO(color, size);
    }
}

