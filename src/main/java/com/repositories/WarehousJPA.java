package com.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.entities.Warehous;

@Repository
public interface WarehousJPA extends JpaRepository<Warehous, Integer> {
	
	@Query("SELECT w FROM Warehous w WHERE w.productVersionBean.id =:productVersionId")
	List<Warehous> findWerehousByProductVersionId(@Param("productVersionId")Integer productVersionId);
}
