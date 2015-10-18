package utils

import java.util.Locale

object FormattedOutPuts {
  def formattedvalue(finalTotal: scala.math.BigDecimal) = {
    val pattern = "###,###.###";
    val locale = new Locale("es", "CL");
    val symbols = new java.text.DecimalFormatSymbols(locale);
    symbols.setGroupingSeparator('.');
    val decimalFormat = new java.text.DecimalFormat(pattern, symbols);
    decimalFormat.setGroupingSize(3);
    val format = decimalFormat.format(finalTotal);
    format
  }

  def fromPredicate(choice: String): String = choice match {
    case "eq" => " = "
    case "gt" => " > "
    case "lt" => " < "
    case "ge" => " >= "
    case "le" => " =< "
    case "cn" => " like "
    case _    => "error"
  }
}