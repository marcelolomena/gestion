package utils

import java.util.Calendar
import java.text.SimpleDateFormat
import java.text.DecimalFormat
import org.apache.commons.lang3.time.DateUtils
import org.joda.time._
import java.util.Date
object DateTime {
  val df = new DecimalFormat("00");
  def getMaxDaysForMonth(month_number: Integer): Integer = {
    var max_number = 0
    var count = 0
    val test = DateUtils.addMonths(new java.util.Date(), 2);
    val today = Calendar.getInstance()
    today.setTime(test)
    max_number = today.getMaximum(Calendar.DAY_OF_MONTH)

    if (max_number == 29) {
      max_number = 28
    }
    max_number

  }
  
  def getCurrentYear() : Integer = {
    var year = Calendar.getInstance().get(Calendar.YEAR);
    return year;
  }
  
  def getNumberOfDaysInMonth(month : Integer) : Integer = {
    var cal = Calendar.getInstance();
	cal.set(Calendar.MONTH, month)
	cal.set(Calendar.DAY_OF_MONTH, 1);
	cal.add(Calendar.DAY_OF_MONTH, -1);
	return cal.get(Calendar.DAY_OF_MONTH);
  }

  
  def getMonthName(month_number: Int): String = {
    var max_number = ""
    val today = new DateTime().plusMonths(month_number - 1);
    max_number = new SimpleDateFormat("MMM yyyy").format(today.toDate())
    max_number
  }

  def getMonthNumber(month_number: Integer): String = {
    val today = new DateTime().plusMonths(month_number - 1);
    var month = ""
    if (today.getMonthOfYear() < 10) {
      month = "0" + today.getMonthOfYear()
    } else {
      month = today.getMonthOfYear().toString().trim()
    }
    month
  }

  def getYearNumber(month_number: Integer): Integer = {
    var max_number = 0
    val today = Calendar.getInstance()
    today.setTime(new java.util.Date())
    today.add(Calendar.MONTH, today.get(Calendar.MONTH) + month_number)
    max_number = today.get(Calendar.YEAR)
    max_number
  }

  def addDateByNDays(c_date: Date, days: Integer): Date = {
    val current_date = new Date()
    val dformat = new java.text.SimpleDateFormat("dd-MM-yyyy")
    val today = Calendar.getInstance()
    today.setTime(c_date)
    today.add(Calendar.DATE, days);
    val tmpDate = dformat.format(today)
    val newDate = dformat.parse(tmpDate)
    newDate
  }
}