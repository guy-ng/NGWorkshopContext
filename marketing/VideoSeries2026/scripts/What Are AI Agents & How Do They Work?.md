
# What Are AI Agents & How Do They Work?


AI labs like open air and Google spent

0:03

years perfecting LLMs. But the real

0:05

breakthrough happening right now isn't

0:07

better LLMs, but a shift from talking to

0:10

doing. So what turns a powerful LLM into

0:12

something that can actually research,

0:14

book flights, write code, or manage your

0:17

entire project. AI agents. Here is the

0:20

difference between an LLM and an AI

0:22

agent. LMS are neural networks trained

0:25

on internet data. They are great at

0:27

predicting text, answering questions,

0:29

and explaining concepts, but they have

0:31

clear limits. For example, if you ask,

0:33

"What is the weather in San Francisco

0:35

today?" A plain LLM does not have

0:38

today's live data. It might confidently

0:40

guess, but it isn't actually checking

0:42

anything. Or if you ask it to research

0:45

AI trends with citations, it cannot

0:47

reliably search the web or verify

0:49

sources. It is just generating text.

0:51

Think of the LLM as a human brain. A

0:53

brain can reason and plan, but it cannot

0:56

directly interact with the outside

0:58

world. It can't open a browser or send

1:01

an email. Humans become powerful because

1:03

the brain coordinates with hands, eyes,

1:05

and external tools. An AI agent wraps an

1:09

LLM with three specific components.

1:11

Tools to act, memory to remember, and a

1:15

reasoning loop to get the task done. It

1:18

is not a new model but software that

1:20

orchestrates this system allowing the

1:23

LLM to provide more value than just

1:25

generating tokens. Let's look into each

1:27

component starting with tools. Tools are

1:30

external capabilities the LLM accesses

1:34

whenever it needs extra information or

1:36

wants to take action. These tools can be

1:39

simple Python functions like a

1:41

calculator or external APIs like search

1:44

booking and internal company services.

1:47

Each tool is defined by a schema telling

1:49

the LLM what inputs it expects. When the

1:53

LLM needs a tool, it outputs a

1:55

structured call showing which function

1:57

or API to use and with what arguments.

2:00

The agents orchestrator runs the

2:02

function and feeds the result back to

2:04

the LLM. For example, if you ask what is

2:08

17 * 24, the LLM recognizes it needs a

2:11

calculator. It outputs a specific tool

2:14

call with the arguments 17 and 24. The

2:18

agents orchestrator executes this

2:20

function, receives 408, and feeds it

2:23

back to the model so it can answer 17 *

2:26

24 is 48. Or consider a request like

2:30

book dinner for 2 tomorrow at 700 p.m.

2:33

in San Francisco. The LLM asks for a web

2:36

search to find restaurants. The agent

2:38

calls the search tool and feeds the

2:40

results back to the LLM. Then the LLM

2:43

asks to book a specific place and the

2:45

agent calls a booking API with the

2:47

restaurant time and party size. The LLM

2:50

receives the result back and outputs a

2:52

confirmation. The second key component

2:55

is memory. If the LLM is the processor,

2:58

memory is the hard drive. There are two

3:01

kinds of memory in an AI agent.

3:03

Short-term memory and long-term memory.

3:06

Short-term memory is the LLM's context

3:08

window. This is everything the model can

3:10

see in the current conversation and the

3:12

current working state. Shorter memory is

3:14

great for keeping track of what the user

3:17

just said, what the agent just tried,

3:19

and the immediate plan, but it is

3:21

limited by the context length. Long-term

3:24

memory involves storing information

3:26

outside the LLM and then retrieving it

3:28

when needed. The agent can store user

3:31

preferences, previous tasks, notes from

3:34

earlier conversations or company

3:35

documents. When a new question comes in,

3:38

the agent retrieves relevant info and

3:41

pulls it into the context. For example,

3:43

if you travel often, the agent stores

3:46

your past conversations which indicate

3:48

you prefer oil seats and direct flights.

3:51

month later when you ask for a new trip,

3:54

it retrieves those preferences from the

3:56

long-term memory into the context window

3:58

to plan accordingly. The most critical

4:01

part is the reasoning loop. Instead of

4:03

the LLM being a oneshot chatbot, this

4:05

loops turns an LLM into an agent by

4:08

placing it within a continuous cycle.

4:11

Here is how the loop works. The LLM

4:14

processes the context and thinks about

4:15

the task, decides which action to run,

4:18

produces the tool call, and the agent

4:21

feeds the outcome back to the LLM.

4:23

Instead of stopping here, the LLM

4:25

reasons again. It iterates until it

4:28

reaches a goal or decides it cannot

4:30

proceed. A common pattern is react, a

4:33

prompting technique that instructs the

4:35

model to follow the strict thought

4:37

action observation format. Imagine you

4:39

ask find a United flight to New York

4:42

next Friday under $300. The agent enters

4:45

a loop to process this. It starts with a

4:48

thought. I first need to check what date

4:50

next Friday is. The LLM requests an

4:53

action by outputting calendar tool. The

4:55

agent runs the function and sends a

4:57

result back as observation. Next Friday

5:00

is October 18th. The LLM takes that

5:03

observation and loops again with a new

5:05

thought. Now I can search for flights.

5:07

It produces a call to the flight API

5:10

tool with the date and price limit. The

5:12

agent returns a list of flights as

5:14

observations. Finally, the LLM

5:17

concludes, "Found United Flight 294 for

5:21

$280 departing at 10:00 a.m." and

5:24

returns the final answer. This reasoning

5:26

loop makes agents reliable. If a tool

5:28

fails, the agent retries. If the request

5:31

is unclear, it asks a question rather

5:34

than guessing. In short, an AI agent is

5:37

just a looping system built around an

5:39

LLM with access to tools and memory. It

5:42

reasons about a goal, plans next steps,

5:46

uses the right tools, and remembers its

5:48

progress to get the job done.

