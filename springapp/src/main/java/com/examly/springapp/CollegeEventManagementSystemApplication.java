package com.examly.springapp;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CollegeEventManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(CollegeEventManagementSystemApplication.class, args);
	connection();
	}
	 public static void connection() {
	 String url="jdbc:mysql://localhost:3306/users_app_devo";
	 String user="root";
	 String pass="root";
	 
	 try(Connection con=DriverManager.getConnection(url, user, pass);){
		 if(con!=null) {
			 System.out.print("Connected Successfully");
		 }
	 }
	 catch(SQLException e) {
		 System.out.print("Failed to connect"+e.getMessage());
	 }
 }
}
