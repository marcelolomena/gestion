package models
import anorm.SqlParser._
import anorm._

case class Indicators(ev: Double, pv : Double, ac : Double, spi: Double, cpi: Double,
  pai: Double, etc: Double, eac: Double, pae : Double, ha : Double, hp : Double)
  
object Indicators extends CustomColumns{

  val indicators = {
		  get[Double]("ev") ~
		  get[Double]("pv") ~
		  get[Double]("ac") ~
	      get[Double]("spi") ~
	      get[Double]("cpi") ~
	      get[Double]("pai") ~
	      get[Double]("etc") ~
	      get[Double]("eac") ~ 
	      get[Double]("pae") ~ 
	      get[Double]("ha") ~ 
	      get[Double]("hp")  map {
        case ev ~ pv ~ ac ~ spi ~ cpi ~ pai ~ etc ~ eac ~ pae ~ ha ~ hp => Indicators(ev, pv, ac, spi, cpi, pai, etc, eac, pae, ha, hp)
      }
  }
}