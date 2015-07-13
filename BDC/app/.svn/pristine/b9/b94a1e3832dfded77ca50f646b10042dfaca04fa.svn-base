package models
import anorm.SqlParser._
import anorm._
import java.util.Date

case class SpiCpiCalculations(id: Option[Int], pid: Int, fecha: Option[Date], vp: Option[Double], vg: Option[Double],
  vb: Option[Double], spi: Option[Double], cpi: Option[Double], tp: Option[Int], ta: Option[Int], evp: Option[Double], evg: Option[Double], evb: Option[Double], espi: Option[Double], ecpi: Option[Double])

object SpiCpiCalculations extends CustomColumns {

  val spiCpiCalculations = {
    get[Option[Int]]("id") ~
      get[Int]("pid") ~
      get[Option[Date]]("fecha") ~
      get[Option[Double]]("vp") ~
      get[Option[Double]]("vg") ~
      get[Option[Double]]("vb") ~
      get[Option[Double]]("spi") ~
      get[Option[Double]]("cpi") ~
      get[Option[Int]]("tp") ~
      get[Option[Int]]("ta") ~
      get[Option[Double]]("evp") ~
      get[Option[Double]]("evg") ~
      get[Option[Double]]("evb") ~
      get[Option[Double]]("espi") ~
      get[Option[Double]]("ecpi") map {
        case id ~ pid ~ fecha ~ vp ~ vg ~ vb ~ spi ~ cpi ~ tp ~ ta ~ evp ~ evg ~ evb ~ espi ~ ecpi => SpiCpiCalculations(id, pid, fecha, vp, vg, vb, spi, cpi, tp, ta, evp, evg, evb, espi, ecpi)
      }
  }
}