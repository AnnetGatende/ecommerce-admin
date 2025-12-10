"use client";

import { useEffect, useState } from "react";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

export const SetupPageClient = () => {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);
  const { isSignedIn, isLoaded } = useUser();
  const [hasCheckedStore, setHasCheckedStore] = useState(false);

  useEffect(() => {
    const checkUserStore = async () => {
      if (isLoaded && isSignedIn && !hasCheckedStore) {
        try {
          // Check if user already has a store
          const response = await axios.get('/api/stores');
          const stores = response.data;
          
          // If user has no stores, show the modal
          if (stores.length === 0 && !isOpen) {
            onOpen();
          }
        } catch (error) {
          // If there's an error (like 401), don't show the modal
          console.log('Error checking stores:', error);
        } finally {
          setHasCheckedStore(true);
        }
      }
    };

    checkUserStore();
  }, [isLoaded, isSignedIn, hasCheckedStore, isOpen, onOpen]);
  
  return null;
};
