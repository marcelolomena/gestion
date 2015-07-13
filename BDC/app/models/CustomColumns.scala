package models

import anorm.{ TypeDoesNotMatch, MetaDataItem, Column }
import java.text.DecimalFormat
import java.text.ParsePosition
import java.text.NumberFormat

/**
 * Created by jayawant on 31-12-2014.
 */
trait CustomColumns {

  implicit def rowToDouble: Column[Double] = Column.nonNull { (value, meta) =>
    val dd = new DecimalFormat("#.##");
    val MetaDataItem(qualified, nullable, clazz) = meta
    value match {
      case d: Double => Right(d)
      case bi: java.math.BigDecimal => Right((bi.doubleValue()))
      case _ => Left(TypeDoesNotMatch("Cannot convert " + value + ":" + value.asInstanceOf[AnyRef].getClass + " to Double for column " + qualified))
    }
  }

  implicit def rowToBoolean: Column[Boolean] = Column.nonNull { (value, meta) =>
    val MetaDataItem(qualified, nullable, clazz) = meta
    value match {
      case bool: Boolean => Right(bool)
      case short: Short => Right(short == 1)
      case _ => Left(TypeDoesNotMatch("Cannot convert " + value + ":" + value.asInstanceOf[AnyRef].getClass + " to Boolean for column " + qualified))
    }
  }
  implicit def rowToInt: Column[Int] = {
    Column[Int](transformer = { (value, meta) =>
      val MetaDataItem(qualified, nullable, clazz) = meta
      value match {
        case int: Int => Right(int)
        case short: Short => Right(short.toInt)
        case null => Right(0)
        case _ => Left(TypeDoesNotMatch("Cannot convert " + value + ":" + value.asInstanceOf[AnyRef].getClass + " to Int for column " + qualified))
      }
    })
  }

  def parseDouble(s: String)(implicit nf: NumberFormat) = {
    val pp = new ParsePosition(0)
    val d = nf.parse(s, pp)
    if (pp.getErrorIndex == -1) Some(d.doubleValue) else None
  }

  implicit def rowToLong: Column[Long] = Column.nonNull { (value, meta) =>
    val MetaDataItem(qualified, nullable, clazz) = meta
    value match {
      case int: Int => Right(int: Long)
      case long: Long => Right(long)
      case bd: java.math.BigDecimal => Right(bd.toString().toLong)
      case _ => Left(TypeDoesNotMatch("Cannot convert " + value + ":" + value.asInstanceOf[AnyRef].getClass + " to Long for column " + qualified))
    }
  }
}
