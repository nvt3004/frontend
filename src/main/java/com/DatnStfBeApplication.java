package com;

import java.util.Date;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DatnStfBeApplication {

	public static void main(String[] args) {
		SpringApplication.run(DatnStfBeApplication.class, args);
		System.out.println("Current time" + new Date());
	}

}
