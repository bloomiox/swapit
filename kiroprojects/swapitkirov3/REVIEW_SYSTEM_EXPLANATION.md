# Review System Explanation

## How the Review System Works

### Current Implementation
The review system is designed to allow **both parties** in a swap to leave reviews for each other after a successful swap completion.

### Database Structure
- **reviews table**: Each review record represents one user's review of another user for a specific swap
- **Unique constraint**: `(swap_request_id, reviewer_id)` - ensures each user can only leave ONE review per swap
- **Key fields**:
  - `reviewer_id`: The user leaving the review
  - `reviewee_id`: The user being reviewed
  - `swap_request_id`: The swap this review is about

### Review Flow Example

**Scenario**: User A wants User B's item and offers their own item in exchange.

1. **Swap Request Created**:
   - `requester_id`: User A
   - `owner_id`: User B
   - `requested_item_id`: User B's item
   - `offered_item_id`: User A's item

2. **After Swap is Accepted**:
   - Both users can now leave reviews
   - **User A's pending review**: Review User B (the owner)
   - **User B's pending review**: Review User A (the requester)

3. **Review Records Created**:
   ```sql
   -- User A reviews User B
   INSERT INTO reviews (
     swap_request_id, 
     reviewer_id, -- User A
     reviewee_id, -- User B
     rating, 
     comment
   );
   
   -- User B reviews User A  
   INSERT INTO reviews (
     swap_request_id,
     reviewer_id, -- User B  
     reviewee_id, -- User A
     rating,
     comment
   );
   ```

### Current Code Logic

The `usePendingReviews` hook:
1. Gets all accepted swaps where the user is involved (as requester OR owner)
2. Filters out swaps where the user has already left a review
3. For each remaining swap, determines who the user should review:
   - If user is the requester → review the owner
   - If user is the owner → review the requester

### Expected Behavior

✅ **Both users should see pending reviews**: After a swap is accepted, both parties should see it in their "Pending Reviews" section until they submit their review.

✅ **Independent reviews**: User A can submit their review without affecting User B's ability to submit theirs.

✅ **Mutual feedback**: Both users get rated and can build their reputation on the platform.

### Verification

To verify both users can leave reviews:
1. User A accepts a swap request from User B
2. Both User A and User B should see the swap in their "Pending Reviews"
3. User A submits a review for User B
4. User A's pending review disappears, but User B still sees their pending review
5. User B submits a review for User A
6. User B's pending review disappears
7. Both reviews are now visible on their respective profiles