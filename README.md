# [Name of the Project] : [21]
# Members
Project Manager: [Keith Mayle] ([keithpdf1])\
Communications Lead: [Skylar David] ([Sdav239])\
Git Master: [Jaylin Anderson] ([Jand245])\
Design Lead: [Nile Hedrick] ([AnwarTabor])\
Quality Assurance Tester: [Justin Ramirez] ([Jramx])

# About Our Software

We are planning to develop an automated event finder web application that will dynamically pull event data from sources such as Eventbrite and Google Events. The app will include features such as event filters (by location, date, and type) and links to directions. Additionally, it will suggest popular food spots near each event.
We are also considering integrating an AI feature to suggest food and drink pairings based on the type of event, offering a unique experience for users attending specific events.

## Platforms Tested on
- MacOS
- Android
- iOS
- Linux
- Windows
# Important Links
Kanban Board: [link]\
Designs: [link]\
Styles Guide(s): [link]

# How to Run Dev and Test Environment
1) Create .venv and .env files[This is crucial to run dev and test ]
   
2) Create a virtual environment in the root directory using:
   ```bash
   python -m venv .venv

 3) Create .env file also in the root directory it should look like this
    
GOOGLE_MAPS_API_KEY=Appropriate Key
EVENTBRITE_API_KEY=Appropriate Key
SERPAPI_KEY=Appropriate Key

SUPABASE_URL="Appropriate Key"

SUPABASE_API_KEY="Appropriate Key"

Appropriate Keys have been shared privately

Now that the .venv and .env files exist you need to activate the .venv
for:
Windows: .venv\Scripts\activate
MaC / Linux : source .venv/bin/activate

Finally install all dependacies. These are listed in requirements.txt
to install them run : pip install -r requirements.txt
    


## Dependencies
- List all dependencies here
- Don't forget to include versions
- aiohappyeyeballs==2.5.0
aiohttp==3.11.13
aiosignal==1.3.2
annotated-types==0.7.0
anyio==4.8.0
attrs==25.1.0
beautifulsoup4==4.13.3
blinker==1.9.0
certifi==2025.1.31
charset-normalizer==3.4.1
click==8.1.8
colorama==0.4.6
deprecation==2.1.0
Flask==3.1.0
frozenlist==1.5.0
googlemaps==4.10.0
gotrue==2.11.4
h11==0.14.0
h2==4.2.0
hpack==4.1.0
httpcore==1.0.7
httpx==0.28.1
hyperframe==6.1.0
idna==3.10
itsdangerous==2.2.0
Jinja2==3.1.5
lxml==5.3.1
MarkupSafe==3.0.2
multidict==6.1.0
packaging==24.2
postgrest==0.19.3
propcache==0.3.0
pydantic==2.10.6
pydantic_core==2.27.2
python-dateutil==2.9.0.post0
python-dotenv==1.0.1
realtime==2.4.1
requests==2.32.3
six==1.17.0
sniffio==1.3.1
soupsieve==2.6
storage3==0.11.3
StrEnum==0.4.15
supabase==2.13.0
supafunc==0.9.3
typing_extensions==4.12.2
urllib3==2.3.0
websockets==14.2
Werkzeug==3.1.3
yarl==1.18.3

### Downloading Dependencies
Describe where to download the dependencies here. Some will likely require a web download. Provide links here. For IDE extensions, make sure your project works with the free version of them, and detail which IDE(s) these are available in.

Dependcies are listed in requirements.txt
to install them run : pip install -r requirements.txt

Required IDE extentions : You will need a pyhton extention

## Commands
Describe how the commands and process to launch the project on the main branch in such a way that anyone working on the project knows how to check the affects of any code they add.

```sh
Example terminal command syntax
```

It is very common in these sections to see code in peculiar boxes to help them stand out. Check the markdown section of the Project Specifications to see how to add more / customize these.

```python
def code_highlight_example(m: int, m: float, s: str) -> str:
	return s + str(n*m)
```

```java
public static void main(String[] args){
	System.out.println("Hello, World!");
}
```

```c#
static void Main(){
	Console.WriteLine("Hello, World!");
}
```
