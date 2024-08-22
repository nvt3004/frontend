package com.utils;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

import org.apache.xmlbeans.impl.regex.ParseException;

public class DateUtils {

	public static Date convertStringToDate(String dateString, String timeZone) throws ParseException, java.text.ParseException {
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		dateFormat.setTimeZone(TimeZone.getTimeZone(timeZone));
		return dateFormat.parse(dateString);
	}
}
