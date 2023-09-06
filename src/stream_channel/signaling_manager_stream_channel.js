import SignalingManagerAuthentication from "../authentication_workflow/signaling_manager_authentication.js";

const SignalingManagerStreamChannel = async (
  messageCallback,
  eventsCallback
) => {
  let streamChannel = null;
  let role = "publisher"; // set the role to "publisher" or "subscriber" as appropriate

  // Extend the SignalingManager by importing it
  const signalingManager = await SignalingManagerAuthentication(
    messageCallback,
    eventsCallback
  );

/*  const topicJoinAndLeave = async function (isTopicJoined, topicName) {
    if (isTopicJoined === false) {
      await signalingManager.getSignalingStreamChannel().joinTopic(topicName).then((response) => {
        messageCallback("Joined the topic: " + response.topicName);
      });
      await signalingManager.getSignalingStreamChannel().subscribeTopic(topicName);
    } else {
      signalingManager.getSignalingStreamChannel().leaveTopic(topicName).then((response) => {
        console.log(response);
        messageCallback("left topic: " + response.topicName);
      });
    }
  }; */

  const topicJoinAndLeave = async function (isTopicJoined, topicName) {
    if (isTopicJoined === false) {
      try {
        // Join the topic
        const response = await signalingManager.getSignalingStreamChannel().joinTopic(topicName);
        messageCallback("Joined the topic: " + response.topicName);
        // Subscribe to the topic to receive topic messages
        await signalingManager.getSignalingStreamChannel().subscribeTopic(topicName);
      } catch (error) {
        console.error("Error joining the topic:", error);
      }
    } else {
      try {
        // Unsubscribe from the topic
        await signalingManager.getSignalingStreamChannel().unsubscribeTopic(topicName);
        // Leave the topic
        const response = await signalingManager.getSignalingStreamChannel().leaveTopic(topicName);
        console.log(response);
        messageCallback("Left topic: " + response.topicName);
      } catch (error) {
        console.error("Error leaving the topic:", error);
      }
    }
  };
  
  const sendTopicMessage = function (message, topicName) {
    if (message === "" || topicName === "") {
      console.log(
        "Make sure you specified a message and a topic to send messages"
      );
      return;
    }
    signalingManager.getSignalingStreamChannel().publishTopicMessage(topicName, message).then((response) => {
      console.log(response);
      messageCallback("Topic: " + topicName + ",  Message:" + message);
    });
  };

  // Return the extended signaling manager
  return {
    ...signalingManager,
    sendTopicMessage,
    topicJoinAndLeave,
  };
};

export default SignalingManagerStreamChannel;
