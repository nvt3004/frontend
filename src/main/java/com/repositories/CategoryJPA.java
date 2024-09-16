package com.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.entities.Category;

public interface CategoryJPA extends JpaRepository<Category, Integer> {

}
