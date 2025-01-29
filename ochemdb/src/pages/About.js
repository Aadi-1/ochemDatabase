import React from "react";
import "./pages.css";

function About() {
  return (
    <div className="instructions-container">
      <h1>About Ochem DB</h1>

      <section>
        <h2>👨‍💻 About Me</h2>
        <p>
          What's up my name is <strong>Aadi Arunkumar</strong>. I am a former
          student at UCR. I majored in Biology with a Minor in Data Science. I
          made this website because through my Organic Chemitry class I realized
          that it was super tedious to look up each chemical and find a website
          that has all the information I need. So I decided to make one
          centralized location that has all of the chemicals I needed. I left
          room for further implementation in the Database for more chemicals.
        </p>
        <p>
          If you have feedback or notice any missing chemicals, feel free to
          email me at:
          <a
            href="mailto:aadithrowacct@gmail.com"
            style={{ textDecoration: "none", color: "blue" }}
          >
            aadithrowacct@gmail.com
          </a>
        </p>
      </section>

      <section>
        <h2>🛠️ How I Built This</h2>
        <p>
          Using the Material Safety Data Sheets (MSDS) from my last O-Chem
          class(8LC), I created a database of ~30 chemicals using MongoDB.
        </p>
        <p>
          After that I created a server with Flask. I made multiple routes for
          the users like searching, requesting, generating a table. After that I
          started implemented the Frontend which was mainly a mix of Java,
          HTML/CSS. I do not like HTML/CSS, imo i think it’s a gross language
          but it gets the job done.
        </p>
        <p>
          One of the biggest issues I had was the search bar that has the
          autofill suggestions. You would be surprised how long that took me to
          get. I mean theres probably an easier way to do it but it’s my first
          time yk. After all that, I just had to make the website look
          presentable, chose some colors. And it was done.
        </p>
      </section>

      <section>
        <h2>🚀 Looking Ahead</h2>
        <p>
          I had some experience in frontend and backend development, but i never
          had the time to complete it. This project started around 2023, so took
          way too long to complete. Most of the work was acc done in December
          and January. I started grinding this project hardest in December and I
          set a goal to be done by the end of January.
        </p>
        <p>
          I’m not really sure if anyone will use this website or read this
          message. I hope that I can keep one growing and gain more experience
          in full stack development. This isn’t the lat project I will make so
          check out my socials for more!
        </p>
        <p>
          If you're reading this, I hope you know you can acheive anything you
          want. No matter how big, never give up. Achieving Success is like a
          marathon but you don't know where the finish line is. That's why you
          ever stop trying.
        </p>
      </section>
    </div>
  );
}

export default About;
