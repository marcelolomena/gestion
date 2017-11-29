# Kanban
![alt tag](https://github.com/jsflax/kanban/blob/master/kanban_map.png)

## Migrating to Scala

So you've decided to finally grow up from Java. You don't want to leave the JVM, but you don't want the verbosity of Java, nor the half-cocked languages that followed.
I present: Scala. Started in 2003 in the Swiss Alps, Scala sounded like an idea that shouldn't work: with so many people believing so strongly in so many different paradigms, let's create
a language that does it all. Like OOP? Like functional programming? Have both. Hate singletons and operator overloading? Let's come to a compromise. Inheritance got you down? Have traits instead.
I'm happy to say after having worked with this in my personal time (see: at my own leisure), that this language, does, surprisingly work. And it works well. I mean really well. I don't
want to code in anything else. And not only that -- it's fun. It hasn't felt this good to code since my first real program got released into the public.

Simply put, I cannot teach you the entirety of Scala here. The best place to start would, of course, be the Scala home page: [Scala: Object Oriented Meets Functional](http://www.scala-lang.org/).
My goal here is to introduce some of the idioms of Scala, as well as some of the syntactical differences.

As a note: Scala is a strongly typed language. It uses structural typing, as opposed to full on duck typing. You do have a concept of full polymorphism just like
Java. However, the Scala ```Any``` class replaces the Java ```Object``` class:
![alt tag](http://www.scala-lang.org/old/sites/default/files/images/classhierarchy.png)

It is certainly looser than Java, but not as loose as a true scripting language. As an example, functions do not need to explcitly declare their return types,
but it is still implicitly in existence. Scala does offer you the ability to write your own implicit conversions, which is quite nice, though I have never
had the opportunity to use this myself.

### Classes, Case Classes, and Objects
#### class
A class in scala is your classic class structure, near identical to Java's.
```scala
class A extends B {
     def this() {
        this()
     }
}
```
With the exception of the constructor, that should look quite familiar.
#### case class
So what is a case class? Case classes can be seen as plain
and immutable data-holding objects that should exclusively depend on their constructor arguments. This is, in fact, a functional concept.
This allows us to:
- use a compact initialisation syntax (Node(1, Leaf(2), None)))
- decompose them using pattern matching
- have equality comparisons implicitly defined

A general rule of them is that if an object performs stateful computations on the inside or exhibits other kinds of
complex behaviour, it should be an ordinary class.
```scala
case class UserBase(email : String,
                    firstName : String,
					lastName : Option[String],
				    username : String,
				    password : String,
					avatarUrl : Option[String],
					var authorizedBoards : Option[Set[Long]],
					var id : Option[Long])
```
As a note, the same constructor syntax here can be used for regular classes.
#### object
Objects are, aside from being confusingly named when speaking classically about OOP, are essentially singletons. These can be standalone
singletons, or static instances of a companion class.
```scala
object UserBase {
     lazy val DefaultAvatarUrl: String = "http://s3-us-west-1.amazonaws.com/witty-avatars/default-avatar-2-l.jpg"
}
```
So we have a singleton companion class to the previous ```UserBase``` case class. The constant ```DefaultAvatarUrl``` can be accessed as you
would any static member: ```UserBase.DefaultAvatarUrl```. As a note, constants in Scala are styled as upper camel case. No more Java all caps
snake case. A full style guide can be found here: http://docs.scala-lang.org/style/naming-conventions.html .
### Var, val, lazy, optional arguments, and def
These are tough concepts to teach individually. It is better to understand them together since they are all so tightly coupled:
```scala
case class Rect(left: Int,
                top: Int,
				right: Int,
				bottom: Int,
				color: Color = null)
var newRectangle: Rect = null
lazy val bigBlueRect = Rect(0,0,500,500,Color.Blue)
def transferRectangleAsRedRect(rect: Rect) {
    newRectangle = rect
	if(newRectangle.color != Color.Red) {
	    newRectangle = Rect(rect.left, rect.top, rect.right, rect.bottom, color=Color.Red)
	}
}
```
What we have to begin is a case class, with a single optional argument called color. Note that all of these construction args are ```val```.
This means that these are **immutable** variables. They cannot be changed after a new Rect has been constructed.

From there we have declared a field in this file called "newRectangle":
```scala
var newRectangle: Rect = null
```
```var``` means that this variable is **mutable**. It can, and will be changed later. The difference between var and val is not just for
the compiler to optimize your code: it is expressive to the reader of what you intend to do with this data.

From there we have our first ```lazy val```:
```scala
lazy val bigBlueRect = Rect(0,0,500,500,Color.Blue)
```
So what is this sorcery? ```lazy``` in Scala just means that this variable will not be initialized until it's first use. The Java equivalent
that should be recognizable:
```java
Rect bigBlueRect = null;
public void getBigBlueRect() {
     if (bigBlueRect == null) {
	      bigBlueRect = new Rect(0,0,500,500,Color.Blue);
     }
	 return bigBlueRect;
}
```
It is a very nice optimization feature. The return value can also be a high order function if you would like.

Moving on from there, we have our first ```def```, or, function definition. This function takes a single parameter, rect. Note that all function
parameters are immutable vals.
```scala
def transferRectangleAsRedRect(rect: Rect) {
    newRectangle = rect
	if(newRectangle.color != Color.Red) {
	     newRectangle = Rect(rect.left, rect.top, rect.right, rect.bottom, color=Color.Red)
	}
}
```
Inside our function, we immediately set our ```var newRectangle``` to the passed in value. And then, just to prove
a point, if it is not of a certain color, we then create a new rect to change it to that color. Why? Because the color field of Rect is an
immutable value, so we have to create a new object. Finally, at the end of this new Rect (also, notice the lack of the keyword ```new```; yay
case classes) we see that I specifically initialize the optional color argument, by using it's name. This can be done for any amount of optional
arguments.
### Implicit
To declare something as implicit in Scala, you ironically have to explicitly declare that it is implicit using the ```implicit``` keyword. Personally,
this is a pattern I very much like about Scala. Many late-generation programming languages have a lot of...magic. Doing 'x' will also cause 'y', 'z',
and 'Billy Bob Thornton' to occur. Huh? I don't get it either. In Scala, if you attempt to go down any magical paths, you must be explicitly declare this.
So... how can something be both explicit and implicit? Let's find out.

There are four main uses of the ```implicit``` keyword in Scala.
#### Implicit Conversions
In any language where you are able to add an Integer to a String, and you are returned a new string with the integer appended on as a character, that integer
is being implicitly converted into that character. Scala allows you to play with this functionality. Let's stick with a simple example for now:
```scala
val i: Int = 3.5
```
3.5 defaults to a Double. It could also be represented as 3.5d, d being the literal. What would happen if we ran this code? Answer:
```scala
error: type mismatch;
   found   : Double(3.5)
   required: Int
   val i: Int = 3.5
```
This is a strongly typed language! So in this case, we can use an declare an implicit conversion that will handle this for us:
```scala
implicit def doubleToInt(x: Double) = x.toInt
val i: Int = 3.5
```
So in this case, 'i' would equal 3, thanks to our function above. Why is this implicit? Well, the function was implicitly called. The compiler knew
to add this conversion. But the best part? We wrote this conversion. It's our implicit conversion. This is not magic. This is convenience.

This can also lead to some cooler, more useful conversions like:
```scala
object Dollar {
    implicit def dollarToEuro(x: Dollar): Euro = ...
}
class Dollar { ... }
```
You can assume how that would work.
#### Implicit Values
Implicit values are simply a play on the concept above. The main difference is that we would be using ```val``` instead of def, and these implicits
would act more as properties of an object with very specific use cases. A good example would be implicit vals for de-serializing or serializing a class
conveniently.
#### Implicit Parameters
Implicit parameters can be attached to any method or class. They are usually a final set of parameters that are not directly passed in; the compiler
searches for them within the calling scope.
```scala
case class Response()(implicit statusCode: Int)
def updateGuy(name: String): Response {
     implicit var statusCode = 200
     Database.update("guy", name) match { // returns how many rows were affected
        case 0 =>
		     statusCode = 400
     }
	 Response() // note the implicit return. idiomatic scala code does not use return unless returning a function early
}
```
The status code of that returned response, if the database update was successful, will be 200, and if unsuccessful, will be 400. This is, of course,
a very simplistic example. The use may not be clear. But consider the fact that you are going to have a series of these CRUD functions -- some with
some complex logic. And you will always be returning a Response data object, no matter what. And let's add an optional message in there, with an optional
data return value as well:
```scala
case class Response(message: String = null, retVal: AnyRef = null)(implicit statusCode: Int)
// note that I would use template types instead of AnyRef here, but that is a lesson for another day
```
Suddenly, being able to cover that variable that we know we are going to need is a lot more enticing. This gets a lot more useful when tied together
with the implicit values I mentioned above. It can enable the perfect master-slave relationship between classes, as a sort of replacement for
interfaces/delegates.
#### Implicit Classes
Implicit classes are quite similar, though tie together closely with the classes you import into your file. Take the following code:
```scala
object Helpers {
  implicit class IntWithTimes(x: Int) {
      def times[A](f: => A): Unit = {
	        def loop(current: Int): Unit =
			     if(current > 0) {
					f
			        loop(current - 1)
		         }
			loop(x)
		}
	}
}
```
Let's talk about one thing before we continue. As you can see here, like many other functional languages, you can nest functions with in functions.
I find this to be *generally* bad practice, especially in the example above. The exception to the rule would be as a replacement for **goto**
functionality. See the ```KanbanService#returnFullBoardsForUser``` method for an example of the "proper" use of nested functions.

Now that we have that settled, what on Earth is an implicit class? Essentially, it's a shortcut for method calling. For example:
```scala
import Helpers._
5 times println("HI")
```
This, obviously, prints "HI" 5 times. So let's look back at our code, because while the result is clear, the methodology may not be.
```scala
// code is within an object that can be imported
implicit class IntWithTimes(x: Int) {
      def times[A](f: => A): Unit = { ... }
}
```
IntWithTimes is the class we no longer need to worry about *by name*. The only thing to keep in mind is the constructor, which is where we passed
in our 5, implicitly of course. Moving down to the
```scala
times[A](f: => A): Unit = {
```
This will be a quick introduction to templating, but do know in advance that it goes much deeper than this. Let's read right to left in this case,
just for explanation purposes (reading left to right in Scala is generally more appropriate). ```: Unit``` is the equivalent of a ```void``` return in Scala.
```void``` is not a keyword in Scala. ```f: => A``` means that we are going to be passing a function into this function. Yes, soak that in for a second.
```f``` is the function where ```A``` is the return type. By passing in a function of return type ```A```, we are implicitly declaring the template ```[A]```
as type ```A``` as well. This is why we read right to left here. And then the method is called times. So when we have our:
```scala
5 times println("HI")
```
It should be a bit clearer now exactly what is going on here. ```5``` constructs the class, ```times``` is the method call, and ```println("HI")``` is
the function we are passing in (which returns type of ```Unit```, making this call return nothing).

If that was confusing, please reread this section a second time. It will be much clearer the second time that you have been initially exposed.
### Traits
Don't like inheritance? Traits are your friends! Do like inheritance? Traits are your friends!

Classic inheritance is great for organizing code by adding a layer of abstraction:

![alt tag](http://blogs.perl.org/users/sid_burn/inheritance1.png)

I don't think I have to explain classic inheritance. The issues in inheritance arrive when we get here:
- Dove -> Flying, Walking
- Tiger -> Walking
- Penguin -> Walking, Swiming
- Goldfish -> Swiming
- Flying Fish -> Swiming, Flying
- Bat -> Flying

Suddenly, we have pre-classified Animals with shared traits and probably a lot of copy and pasted code. Notice how I used the word traits!
Often times, this is solved with "composition". The Dove would have a "Walking" class as a property of the class. This gets verbose and doesn't
read how it should read. Composition is a pretty abstract concept, but not abstract in practice. Introducing, traits:
```scala
trait Animal {
}
trait Legs {
     val legs: Int
}
trait Wings {
     val wings: Int
}
trait Walking extends Legs {
     def walk()
}
trait Flying extends Wings {
     def flying()
}
class Dove extends Animal 
              with Flying
			  with Walking {
	 val wings: Int = 2
	 val legs: Int = 2
	 def walk(){ ... }
     def flying(){ ... }
}
class Tiger extends Animal
               with Walking {
     val legs: Int = 2
	 def walk(){ ... }
}
```

What do we have here? Reusable traits! Better yet, explicitly implied compisition. Fun fact: Scala had gotten rid of the ```extends``` keyword entirely in the early releases,
using only ```with```. However, since basic levels of inheritance do make sense in some cases, ```extends``` was added back in. As you can see, traits read like plain english,
and work very well in abstracting old paradigms. Look at the ```KanbanService``` class for an more realistic example of how these traits can be incredibly useful. Personally,
I find that it allows for a much cleaner organization of code. Everything is exactly where it should be. Scala-lang website has another great example:
```scala
abstract class Spacecraft {
  def engage(): Unit
}
trait CommandoBridge extends Spacecraft {
  def engage(): Unit = {
      for (_ <- 1 to 3)
	    speedUp()
  }
  def speedUp(): Unit
}
trait PulseEngine extends Spacecraft {
  val maxPulse: Int
  var currentPulse: Int = 0
  def speedUp(): Unit = {
	if (currentPulse < maxPulse)
	   currentPulse += 1
  }
}
class StarCruiser extends Spacecraft
                     with CommandoBridge
					 with PulseEngine {
  val maxPulse = 200
}
```				  
## Play Framework
For those unfamiliar with the Play Framework, we are given a fair amount of features that act implicitly, but are actually quite explicit once
you understand the basic protocol we follow for an object.

Most of the code is quite explicit. Controllers control the flow of information between a service and a client. Models are the data structures
that contain our information into tightly coupled case classes. Services interact with the database to read and write info on command of a client.
With the exception of a few syntactical sugars, all of this should be quite legible, even to those untrained in Scala.

As with any higher generation language though, and especially in a language with it's on DSLs, there are several implicit features that I would
like to go over:

### Reads
Most models have implicit reads, writes, and parsers for serialization and de-serialization.

A read would look as follows:
```scala
implicit val reads : Reads[UserBase] = (
    (JsPath \ "email").read(email) and
    (JsPath \ "firstName").read[String] and
    (JsPath \ "lastName").readNullable[String].orElse(Reads.pure(null)) and
    (JsPath \ "username").read[String] and
    (JsPath \ "password").read(minLength[String](8)) and
    (JsPath \ "avatarUrl").readNullable[String] and
    (JsPath \ "authorizedBoards").readNullable[Set[Long]] and
    (JsPath \ "id").readNullable[Long]
  )(UserBase.apply _)
```
JsPath references the the current object being parsed. The '\' operator can be considered as a sort of ".field(fieldName: String)" method.
What we see here is called "JSON combinator syntax", a DSL of the play framework. Reading left to right, it actually reads quite like english:

At the json path, read the field named "email" into the @email parameter of the UserBase, and then move on to the next field.

This implicit value allows us to essentially convert JSON directly into one of our data models.

Reads can also be written as:
```scala
implicit val reads = Json.reads[Project]
```
This will use reflection to "auto-create" the implicit reader using a 1:1 relationship with the names of the classes parameters. Default
read protocol is really only appropriate for single level objects (non-nested).

### Writes
An implicit write would look quite similar:
```scala
implicit val writes = new Writes[FullProject] {
    def writes(fullProject: FullProject): JsValue = {
      Json.obj(
        "project" -> Json.toJson(fullProject.project),
        "kolumns" -> Json.arr(
          Json.toJson(fullProject.columns)
        ),
        "tickets" -> Json.arr(
          Json.toJson(fullProject.tickets)
        )
      )
    }
  }
```
In this case, we have our @FullProject data model, which contains the project model, an array of our kolumn models (yes, it is spelled with a
'k' on purpose), and an array of tickets associated with the project. All we are doing is using the *play.api.libs.Json* singleton to create
a json object. This will now be the implicitly created object when we serialize our data model.

Writes can also be written as:
```scala
implicit val writes = Json.writes[Project]
```
This will use reflection to "auto-create" the implicit writer using a 1:1 relationship with the names of the classes parameters. Default
write protocol is really only appropriate for single level objects (non-nested).

### Anorm RowParsers

A row parser parses a result set from a SQL query (using anorm) into one of our data models. Take the following piece of code:
```scala
protected def getProjectsForBoards(ids: Seq[Long]): Seq[Project] = {
   DB.withConnection { implicit c =>
      SQL(
        s"""
           |SELECT * FROM project
           |WHERE board_id
           |IN (${ids.mkString(",")})
         """.stripMargin
      ).as(Project.parser.*)
   }
}
```
This function takes in a sequence of board IDs, and returns us a sequence of projects. Anorm maintains a connection to the database
(or any database in our config -- if we had more than one, we would have to pass in a parameter to determine which to use), so we
use that context to make a SQL call. In this case, we are selecting each column from the project table where we have a board ID
in the sequence that was passed in. The key here is the final part of the method chain: ```.as(Project.parser.*)```. This is
auto-converting that into our Project data model (those familiar with ORMs should have a clear idea of what is happening now).
This is what a simple parser looks like:
```scala
implicit val parser: RowParser[Project] = {
      get[Long]("board_id") ~
      get[String]("name") ~
      get[String]("prefix") ~
      get[Long]("created_by_user") ~
      get[Long]("id") map {
      case boardId~name~prefix~created~id =>
        Project(boardId, name, prefix, created, Option(id))
    }
  }
```
This should look similar to the combinator "read" syntax from the read section of this ReadMe. We declare the type of object, the
name of the column, and then map it to the appropriate paramater for the class (preferably a case class).

Parsers can also have nested parsers for JOINs. This is where things get tricky:
```scala
implicit val collaboratorParser: RowParser[Ticket] = {
    get[Long]("ticket.project_id") ~
    get[String]("ticket.name") ~
    get[Option[String]]("ticket.description") ~
    UserBase.userParser.? ~
    CommentItem.parser.? ~
    get[Option[Boolean]]("ticket.ready_for_next_stage") ~
    get[Option[Boolean]]("ticket.blocked") ~
    get[Long]("ticket.current_kolumn_id") ~
    get[Option[DateTime]]("ticket.due_date") ~
    get[Option[Boolean]]("ticket.archived") ~
    get[Option[Int]]("ticket.priority") ~
    get[Option[Int]]("ticket.difficulty") ~
    get[Long]("ticket.assigner_id") ~
    get[Long]("ticket.id") map {
    case projectId~name~description~userId~commentItems~readyForNextStage~blocked~kolumnId
      ~dueDate~archived~priority~difficulty~assignerId~id =>
      Ticket(projectId, name, description, Option(Seq(userId.get)), Option(Seq(commentItems.getOrElse(CommentItem(None, None, None, None)))), readyForNextStage, blocked,
        kolumnId, dueDate, archived, priority, difficulty, assignerId, Option(id))
  }
}
```
Kill it with fire! No no, it's not that bad. It should appear familiar to the simple parser: we are doing reads based on type and column name.
The main differences? We are using the table name as a prefix, and the inclusion of the ```UserBase.userParser.?``` line and the
```CommentItem.parser.?``` line. All these are are nested row parsers for the JOINed tables. The '?' at the end just means that they can
be null. Then they are mapped to the object in the same fashion as before.
