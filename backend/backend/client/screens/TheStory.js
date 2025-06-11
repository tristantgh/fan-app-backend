import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Modal, TouchableOpacity } from 'react-native';

// Importing images
import thestory1 from '../assets/thestory1.png';
import thestory2 from '../assets/thestory2.png';
import thestory3 from '../assets/thestory3.png';
import thestory4 from '../assets/thestory4.png';
import thestory5 from '../assets/thestory5.png';
import thestory6 from '../assets/thestory6.png';
import thestory7 from '../assets/thestory7.png';
import thestory8 from '../assets/thestory8.png';
import thestory9 from '../assets/thestory9.jpg';

export default function TheStory() {
  const storyPoints = [
    { image: thestory1, title: 'BIRTH', description: `I was born in Charleston, South Carolina on November 2nd, 2000 to my parents Lauren and Peter Hulsebos. I can't say I remember all too much from this era, but I guess I had a pretty good time lol.` },
    { image: thestory2, title: 'CHARLESTON', description: `I lived in Charleston until I was 8 years old. My parents divorced when I was 3, but I still remained close with both sides of my family - even if it was tough at times. I played a lot of basketball, video games, and ate a lot of Chick-Fil-A. Everyone in my family is pretty musical, so I was always immersed in it, but it hadn't really clicked yet. I had tried playing guitar, but ended up playing Guitar Hero way more and never practiced. Shortly before my mom and I moved to Atlanta though, I was in the car with my uncle and he played me this song - "Ocean Breathes Salty" by Modest Mouse. At this point I was probably 7 years old and I just remember in that moment knowing that music was going to be my life. I didn't know how yet, but I knew that the feeling that song gave me was something I would chase forever.` },
    { image: thestory3, title: 'ATLANTA', description: `When I was 8 years old, my mom and I moved to Atlanta for her to get remarried. She wanted a better upbringing for me and a big new city with some cousins and family friends already there seemed like the perfect place. This is when I reallyyyy fell in love with music. My stepdad had a drum kit and as soon as I sat down, I was hooked. I went to school the next day after playing for the first time and told all my new friends we should start a band. Also around this time, I started writing songs. I didn't really know what I was doing, but I would have melodies stuck in my head from the music I'd listen to on my way to school and I would just write new lyrics to those songs on my notes in class.

Over the course of the next few years, I'd keep playing drums and writing songs for the bands I was in, eventually learning to produce and play guitar, bass, and piano as well. I always knew I wanted to sing my own songs too, but that didn't come until much later - once the singer of our band graduated. Aside from music though, I look back at this chapter of my life very fondly. Of course there were ups and downs, but the great community, friends, and immersion in music I gained during this time are so foundational to who I am.` },
    { image: thestory4, title: 'COLLEGE/COVID', description: `Fast forward to 2019 and I graduated high school. My mom had been wanting to move back to Charleston and with me going off to college, this seemed to be the perfect time. That summer we moved back to Charleston, it was really tough leaving my life in Atlanta behind, but I wanted my mom to be happy and close to our family and everyone was going off to college anyway. In the fall I moved up to Middle Tennessee State University to study Songwriting and Music Business. Before I even got there, I knew I didn't want to graduate. I was ready to start my career and I could hardly think about anything else. At first, school wasn't too bad. I finally was around a lot of people who seemingly wanted to also pursue music. Over time though, I found myself staying in the studio all night time and time again instead of hanging out with everyone. It was challenging knowing my friends from back home were all partying every weekend and my new friends at school didn't want to spend every second possible in the studio with me, but that's the sacrifices we have to make y'know.

March 2020. It's spring break of my freshman year and I drove all the way from MTSU to Charleston to surprise my mom. What started as a surprise turned into me rushing back to my dorm to get all of my belongings and then rushing back to Charleston due to the pandemic. I remember being in the middle of nowhere Tennessee on the highway listening to the state of emergency being announced. I got back to my Mom's house and like most people, I just tried to take it day by day. I was fortunate to stay healthy and isolated during this time and ended up making a lot of music. The most important thing however, was a dream I had. One night in quarantine I had this dream where essentially I saw every chapter of my entire life flash by and I could see that in every single one, music was always there. Every time, without fail. I woke up knowing that now is the time. This is what I am truly meant to do and I will do everything I possibly can to make it happen.

That summer one of my best friends, Zach, and I went up to the University of Georgia to sublet his fraternity brother's apartment and spend a month making a ton of songs. I actually released all of these on Soundcloud under a different name, but eventually took them down (you'll never find them haha). Many new versions of these songs might find their way out into the world sometime soon though…
As quarantine started to become a bit less strict and summer was ending, I was headed back to school for a hybrid semester. I tried convincing my mom to let me go ahead and move to LA, but I had already signed a lease for my apartment in Tennessee and enrolled in school. The next few months after going back to Tennessee were extremely tough for me. I was on the brink of having a panic attack most days and just in a very low place. I was somewhere I didn't want to be, sort of still in quarantine, and wanting to do nothing else but fully pursue music. I was able to get out of this rut though, mainly by to talking to my grandma on the phone most days (she's the best), making as much music as possible between classes, and delivering Uber Eats for money - delivering food when there's barely other cars on the road and a lot of time to think and listen to music and watch the sunset was honestly pretty therapeutic.

In December I wrote a very long essay to my mom explaining why I wanted to "take a semester off" (I was totally dropping out lol) I explained I wanted to focus fully on music and that I wouldn't miss much anyway since school was going to be mainly online the next semester. Somehow she agreed and that same week I sold my very first beat to another artist at my school. At this point, I started really locking in - I was producing for every artist I could, messaging everyone who's contact info I could find in LA, teaching myself to sing, and delivering more Uber Eats to save up money for my eventual move to LA. I actually visited LA one time, April 2021, before moving there. I was fortunate enough to meet a great producer and a few of his friends on this trip, all of whom I'm still very close with. My apartment lease in Tennessee ended on July 31st, 2021 and that same day I hit the road.` },
    { image: thestory5, title: 'MOVING TO LA', description: `I drove down from Tennessee to Atlanta with everything I owned in my car. One of my best friends was having her 21st birthday party and I got to see all of my friends from high school one last time before starting my journey to Los Angeles. One of my friends that night said to me, "we all knew you were going to do this, it was just a matter of when". The next morning, August 1st, 2021, I drove from Atlanta to New Orleans. Then New Orleans to Austin. Then Austin to Tucson. And finally, Tucson to Los Angeles. Would I drive across the country completely alone with all of my possessions in my car stopping as little as possible along the way again? Probably not. But it's without a doubt one of the best experiences of my life so far. I spent a lot of time reflecting on life, listening to early versions of Nomad and a bunch of the music I had made up until that point, podcasts, books, and talking to family and friends. I had a folder of beats I was going to play for everyone I could while I was still working on my voice once I got to LA - the initial plan was to produce for other artists first to get my foot in the door, and then start releasing my own music. This kinda happened…more on that later.

Anyway, I arrived in Los Angeles on August 4th, 2021 knowing nobody except that producer I had met who I loosely kept in touch with over the past few months and one other artist I met on instagram. I had an Airbnb booked for a month and my plan was to take that month to figure out a more long-term living situation. Turns out the Airbnb was a bit of a scam - no AC and no fridge (mind you it was 104 degrees outside at this time). So my one month stay ended up being three days and fortunately that same producer allowed me to crash on his couch for a couple weeks.

As fate would have it, an artist he was producing for at the time had a room open up in the house he was renting. I went to visit the house and met the guys. They showed me around and then in the living room there was a drum kit setup. Everyone started jamming and I sat down on the drums. I basically auditioned for a place to live - very LA. When I later left to go back to sleeping on the couch they said, "we'll text you, also we'll keep you in mind for tour." I moved in the next week.

After moving into that house, I started to get a bit settled in LA. I had a decent friend group and was going out to shows, meeting people, working on Nomad, and trying to get my name out there as a producer first. Fast forward to November and while I was recording the vocals for "She", the first song I ever released actually, my mom called me to tell me my dad had passed away. We hadn't been close in years, but this of course devastated me. I wrote my song "Father" that night and flew back home to be with my family a couple days later. The rest of 2021 was spent back and forth between finishing Nomad in LA and seeing my family in Charleston.` },
    { image: thestory6, title: '2022', description: `I started off this year seeing all of my friends in Atlanta for New Years. Right after that I went back to LA to finish Nomad, releasing my first official song ever, "She", on February 18th, 2022. Also, it turns out I actually was kept in mind for that tour with one of the artists I was living with. We hit the road in March and I was somehow trying to balance releasing singles for Nomad, working under a bigger producer whenever I was in LA, and touring consistently. We played some great festivals and even played a show at the University of Georgia where I got to show all my childhood friends I made the right choice by following my dream (given I was on stage performing for them) and I even got to open for that show and sing for literally anybody for the first time ever in my life. I was definitely terrified and I know I didn't sound that good, but it's a moment I will cherish forever. You just gotta push through sometimes.

Eventually, tour ended and I came back to LA full time. I was bouncing around subletting apartments and staying with friends for the summer while I looked for a new place. During this time, I released Nomad on June 24th, 2022. My first EP. I was selling T-shirts out of my trunk and mailing them to whoever would buy. I was doing everything I could to make my dreams a reality (still am by the way) and that summer is one I know I'll always look back on and smile.

The rest of this year was spent moving into a new place with some mutual friends from Atlanta, drumming and producing for others to stay afloat, putting out more music (Present, The Old You, Winter in Atlanta, Late Night Call) and figuring out what the next steps were going to be for me.
` },
    { image: thestory7, title: '2023', description: `The producer I was working for had sat me down shortly before the new year and gave me the advice I didn't want to hear but, knew I needed to. He told me. "you're good at a lot of things, but if you want to be great at any of them, pick one." He could see that I was spreading myself way too thin, overworking constantly trying to drum and produce for others while also working on my own music and trying to make enough money just to scrape by and pay rent. This conversation changed the course of my life and let me know that it was absolutely without a doubt time to fully focus on my music - so that's what I did. I spent the entire year of 2023 just focusing on making a much music as I possibly could and getting better at my craft every single day.

In January I made "Some Kind of Way" and from there was all in on crafting my second EP "Give Me Something Real" - plus I was falling in love and wanted to make a bunch of really good songs to impress my girlfriend at the time. I spent the next few months writing, recording, and producing those songs and released the full EP on July 28th, 2023. The fans "Some Kind of Way" brought me showed me that I had made the right decision to pursue my music fully and was the fuel I needed to keep going. The rest of this year I spent making much of the music that ended up coming out in 2024. Almost all of the songs from "Something I Can Feel" were made in 2023, along with "Feel You Breathe" and "Dive in Your Soul". I even wrote the first versions of "The Heart I Feel Beat" and "After Work" during this time. I could feel myself getting better and that motivated me so much this entire year.
` },
    { image: thestory8, title: '2024', description: `This year started off a little rough. I went to Charleston on New Year's day as there was a bit of a family emergency, however everyone ended up being okay thankfully. I flew back to LA a few days later and wrote all the lyrics to the final version of "The Heart I Feel Beat" on that flight.

About a month later during some crazy storms in LA, the house I was living in flooded, ruining the majority of my belongings - fortunately with the exception of my clothes and music equipment. This is when I moved in with my good friend Brad, who has now become like a brother to me and who shot the artwork for "The Heart I Feel Beat" and all of the 2025 Singles.

The only downside to this move though (other than most of my possessions getting ruined) is that I didn't really have space to setup most of my recording equipment anymore. Instead of getting upset about this though, I realized this is exactly what I needed. I truly was just shy about posting my music and really did everything I could to avoid it and just keep making music. Not being able to record every day was a sign to me that now is the time to start posting my music and finding my people and my community - and here we are. A lot of you found me around this time. I spent the rest of this year posting all the time, performing on TikTok live constantly, recording whenever I could, and releasing the summer singles (Right Here, We Don't Have to Talk, Dive in Your Soul, Feel You Breathe) and later in the year "The Heart I Feel Beat" EP. I also started modeling and acting during this year. LA is full of side quests lol.
2024 was all about growth for me as a man and an artist.` }, // Insert full text here
    { image: thestory9, title: '2025', description: `` }, // Insert full text here
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);

  const openModal = (point) => {
    setSelectedPoint(point);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPoint(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>THE STORY</Text>
      <Text style={styles.subText}>
        Click each image to learn more about Tristan's life so far...so much lore.
      </Text>

      {storyPoints.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => openModal(item)}>
          <View style={styles.point}>
            <Image source={item.image} style={styles.image} />
            <Text style={styles.imageTitle}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <Text style={styles.modalTitle}>{selectedPoint?.title}</Text>
              <Text style={styles.modalDescription}>{selectedPoint?.description}</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  point: {
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  imageTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: '85%',
    height: '75%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  modalScroll: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    color: '#555',
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#000',
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});