"use client";

// import Avatar from "@/app/components/Avatar";
// import { FullMessageType } from "@/app/types";
// import clsx from "clsx";
// import { format } from "date-fns";
// import { useSession } from "next-auth/react";
// import Image from "next/image";
// import { useState } from "react";
// import ImageModal from "./ImageModal";

// interface MessageBoxProps {
//   data: FullMessageType;
//   isLast?: boolean;
// }

// const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
//   const session = useSession();
//   const [imageModalOpen, setImageModalOpen] = useState(false);

//   const isOwn = session?.data?.user?.email === data?.sender?.email;
//   const seenList = (data.seen || [])
//     .filter((user) => user.email !== data?.sender?.email)
//     .map((user) => user.name)
//     .join(", ");

//   const container = clsx("flex gap-3 p-4", isOwn && "justify-end");
//   const avatar = clsx(isOwn && "order-2");
//   const body = clsx("flex flex-col gap-2", isOwn && "items-end");
//   const message = clsx(
//     "text-sm w-fit overflow-hidden",
//     isOwn ? "bg-sky-500 text- white" : "bg-gray-100",
//     data.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
//   );

//   return (
//     <div className={container}>
//       <div className={avatar}>
//         <Avatar user={data.sender} />
//       </div>
//       <div className={body}>
//         <div className="flex items-center gap-1">
//           <div className="text-sm text-gray-500">{data.sender.name}</div>
//           <div className="twext-xs text-gray-400">
//             {format(new Date(data.createdAt), "p")}
//           </div>
//         </div>
//         <div className={message}>
//           <ImageModal
//             src={data.image}
//             isOpen={imageModalOpen}
//             onClose={() => setImageModalOpen(false)}
//           />
//           {data.image ? (
//             <Image
//               onClick={() => setImageModalOpen(true)}
//               alt="Image"
//               height="288"
//               width="288"
//               src={data.image}
//               className="object-fit cursor-pointer hover:scale-110 transition translate"
//             />
//           ) : (
//             <div className="">{data.body}</div>
//           )}
//         </div>
//         {isLast && isOwn && seenList.length > 0 && (
//           <div className="text-xs font-light text-gray-500">{`Seen by ${seenList}`}</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MessageBox;

import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { saveAs } from "file-saver";
import ImageModal from "./ImageModal";

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const isOwn = session?.data?.user?.email === data?.sender?.email;
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(", ");

  const container = clsx("flex gap-3 p-4", isOwn && "justify-end");
  const avatar = clsx(isOwn && "order-2");
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");
  const message = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
    data.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
  );

  const handleFileDownload= async () => {
    if (data.image) {
      try {
        const response = await fetch(data.image);
        const blob = await response.blob();

        const fileName = window.prompt("Save As");

        if (!fileName) {
          console.log("No filename entered, aborting save.");
          return;
        }

        const fileBlob = new Blob([blob], { type: blob.type });

        saveAs(fileBlob, fileName);
      } catch (error) {
        console.error("Error downloading image:", error);
      }
    } else {
      console.error("Image URL is null or undefined");
    }
  };
  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{data.sender.name}</div>
          <div className="twext-xs text-gray-400">
            {format(new Date(data.createdAt), "p")}
          </div>
        </div>
        <div className={message}>
          <ImageModal
            src={data.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
          {data.image ? (
            <Image
              onClick={handleFileDownload}
              alt="Image"
              height="288"
              width="288"
              src={data.image}
              className="object-fit cursor-pointer hover:scale-110 transition translate"
            />
          ) : (
            <div className="">{data.body}</div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs font-light text-gray-500">{`Seen by ${seenList}`}</div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
